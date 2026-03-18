import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/seekr-logo.png";
import { Search as SearchIcon, Edit3, BadgeCheck, Filter, SortAsc } from "lucide-react";
import LRMissingAction from "../components/LRMissingAction";
import LRClaimedAction from "../components/LRClaimedAction";
import LRRejectedAction from "../components/LRRejectedAction";
import ConfirmModal from "../components/modals/ConfirmModal";
import RejectModal from "../components/modals/RejectModal";
import SuccessModal from "../components/modals/SuccessModal";
import axios from "axios";

const locations = [
  "Atrium", "Lobby", "Library", "Cafeteria", "Gymnasium", "Parking Area",
  "Computer Lab", "Nursing Lab", "Accounting Office", "Registrar's Office",
  "Guidance Office", "Student Center", "Admin Office", "Clinic", "Faculty Room",
  "AVR (Audio Visual Room)", "Stairs", "Comfort Room",
  "Multi Purpose Hall A", "Multi Purpose Hall B", "Multi Purpose Hall C",
  "Lecture Hall A", "Lecture Hall B", "Lecture Hall C", "Others"
];

export default function LostReports() {
  const [activeTab, setActiveTab] = useState("Missing");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortPopup, setSortPopup] = useState(false);
  const [filterPopup, setFilterPopup] = useState(false);
  const [sortType, setSortType] = useState("Date (Newest to Oldest)");
  const [selectedLocations, setSelectedLocations] = useState([]);

  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch current user from localStorage
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user on mount
  useEffect(() => {
    const userJSON = localStorage.getItem("user");
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setCurrentUser(user);
      console.log("✅ Current user loaded:", user.Fname, user.Lname);
    }
  }, []);

  const sortRef = useRef(null);
  const filterRef = useRef(null);

  // Fetch reports from backend
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/lost-reports');
      setAllReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) setSortPopup(false);
      if (filterRef.current && !filterRef.current.contains(event.target)) setFilterPopup(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter data based on active tab
  const getTabData = () => {
    switch (activeTab) {
      case "Missing":
        return allReports.filter(item => item.status === "missing");
      case "Claimed":
        return allReports.filter(item => item.status === "found");
      case "Rejected":
        return allReports.filter(item => item.status === "reject");
      default:
        return [];
    }
  };

  const tabData = getTabData();

  // Enhanced search that checks multiple fields
  const filteredData = tabData.filter(item => {
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(item.location_name);
    
    // Enhanced search functionality
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (item.item_lost && item.item_lost.toLowerCase().includes(searchLower)) ||
      (item.other_description && item.other_description.toLowerCase().includes(searchLower)) ||
      (item.reported_by && item.reported_by.toLowerCase().includes(searchLower)) ||
      (item.location_name && item.location_name.toLowerCase().includes(searchLower)) ||
      (item.brand_lost && item.brand_lost.toLowerCase().includes(searchLower)) ||
      (item.color_name && item.color_name.toLowerCase().includes(searchLower));
    
    return matchesLocation && matchesSearch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortType === "Item Name (A-Z)") return a.item_lost.localeCompare(b.item_lost);
    if (sortType === "Location (A-Z)") return (a.location_name || "").localeCompare(b.location_name || "");
    if (sortType === "Date (Newest to Oldest)") return new Date(b.date_lost) - new Date(a.date_lost);
    if (sortType === "Date (Oldest to Newest)") return new Date(a.date_lost) - new Date(b.date_lost);
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Reject modal state
  const [rejectReason, setRejectReason] = useState("");
  
  // editForm state to track all editable fields
  const [editForm, setEditForm] = useState({});

  // Format date properly for input[type="date"]
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const openModal = (report) => { 
    setSelectedReport(report);
    // Initialize editForm with current report data - DATE NOW FORMATTED CORRECTLY
    setEditForm({
      itemName: report.item_lost,
      brand: report.brand_lost,
      color: report.color_name,
      description: report.other_description,
      location: report.location_name,
      locationDescription: report.location_description,
      date: formatDateForInput(report.date_lost),
      reportedBy: report.reported_by
    });
    setModalOpen(true); 
  };

  const closeAllModals = () => { 
    setModalOpen(false); 
    setConfirmOpen(false); 
    setRejectOpen(false); 
    setSuccessOpen(false); 
    setSelectedReport(null);
    setRejectReason("");
    setEditForm({});
  };

  const handleLocationToggle = (loc) => 
    setSelectedLocations(prev => prev.includes(loc) ? prev.filter(i => i !== loc) : [...prev, loc]);

  const handleApprove = async () => {
    try {
      await axios.put(`http://localhost:5000/api/lost-reports/${selectedReport.lost_id}/approve`, {
        reviewedBy: currentUser.user_id
      });
      setSuccessMessage("The report has been approved.");
      setConfirmOpen(false);
      setSuccessOpen(true);
      fetchReports();
    } catch (error) {
      console.error('Error approving report:', error);
      alert('Failed to approve report');
    }
  };

  // handleReject now sends all editable fields
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/lost-reports/${selectedReport.lost_id}/reject`,
        {
          reviewedBy: currentUser.user_id,
          reason: rejectReason,
          // ALL editable fields
          itemName: editForm.itemName,
          brand: editForm.brand,
          color: editForm.color,
          description: editForm.description,
          location: editForm.location,
          locationDescription: editForm.locationDescription,
          date: editForm.date,
          reportedBy: editForm.reportedBy,
        }
      );
      setRejectOpen(false);
      setSuccessMessage("Report rejected and updated.");
      setSuccessOpen(true);
      setRejectReason("");
      fetchReports();
    } catch (error) {
      console.error("Error rejecting report:", error);
      alert("Failed to reject report");
    }
  };

  const renderActionModal = () => {
    if (!selectedReport || !modalOpen) return null;
    
    const modalReport = {
      id: `L${String(selectedReport.lost_id).padStart(4, '0')}`,
      itemName: selectedReport.item_lost,
      brand: selectedReport.brand_lost,
      color: selectedReport.color_name,
      description: selectedReport.other_description,
      location: selectedReport.location_name,
      locationDescription: selectedReport.location_description,
      date: selectedReport.date_lost,
      dateReported: selectedReport.date_lost,
      dateClaimed: selectedReport.date_claimed,
      reportedBy: selectedReport.reported_by,
      reviewedBy: selectedReport.reviewed_by,
      claimedBy: selectedReport.claimed_by,
      approvedBy: selectedReport.reviewed_by,
      reason: selectedReport.reason,
      lostFound: "Lost",
      // Use media_path directly - backend already returns full URL
      image: selectedReport.media_path || logo
    };

    if (activeTab === "Missing") 
      return (
        <LRMissingAction
          report={modalReport}
          onClose={closeAllModals}
          viewOnly={true}
          onApprove={() => setConfirmOpen(true)}
          onReject={() => setRejectOpen(true)}
          editForm={editForm}
          setEditForm={setEditForm}
          isEditableTab={true}
        />
      );
    if (activeTab === "Claimed") 
      return <LRClaimedAction report={modalReport} onClose={closeAllModals} />;
    if (activeTab === "Rejected")
      return <LRRejectedAction report={modalReport} onClose={closeAllModals} />;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#3A0CA3] font-poppins">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A0CA3] mx-auto mb-4"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#3A0CA3] font-poppins p-4 sm:p-6">
      {/* Search bar */}
      <div className="flex items-center border border-purple-200 rounded-full px-3 py-2 bg-white w-full md:w-1/2 mb-4 [box-shadow:inset_2.88px_2.88px_11.5px_0px_rgba(0,0,0,0.100),5.75px_5.75px_11.5px_0px_rgba(255,255,255,0.75)]">
        <SearchIcon className="w-4 h-4 text-[#3A0CA3] mr-2" />
        <input
          type="text"
          placeholder="Search items..."
          className="outline-none w-full text-sm text-[#3A0CA3] placeholder-[#3A0CA3]/60"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs and Sort/Filter Row */}
      <div className="flex justify-between items-center mb-4">
        {/* Tabs Left */}
        <div className="flex gap-3">
          {["Missing", "Claimed", "Rejected"].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`text-sm font-medium transition ${
                activeTab === tab
                  ? "text-[16px] text-white bg-[#3A0CA3] rounded-full px-4 py-1 shadow-md"
                  : "text-[16px] text-[#3A0CA3] hover:bg-[#3A0CA3]/10 rounded-full px-4 py-1 shadow-md"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort & Filter */}
        <div className="flex gap-2">
          <div className="relative" ref={sortRef}>
            <button onClick={() => { setSortPopup(!sortPopup); setFilterPopup(false); }} className="p-2 rounded-md hover:bg-purple-100 text-purple-700">
              <SortAsc size={20} />
            </button>
            {sortPopup && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-56 p-3 z-50">
                <h3 className="text-sm font-semibold mb-2 text-purple-700">Sort By</h3>
                {["Item Name (A-Z)", "Location (A-Z)", "Date (Newest to Oldest)", "Date (Oldest to Newest)"].map(option => (
                  <button key={option} onClick={() => { setSortType(option); setSortPopup(false); }}
                    className="block w-full text-left p-2 rounded hover:bg-purple-100 text-gray-700 text-sm">
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter */}
          <div className="relative" ref={filterRef}>
            <button onClick={() => { setFilterPopup(!filterPopup); setSortPopup(false); }}
              className="p-2 rounded-md hover:bg-purple-100 text-purple-700">
              <Filter size={20} />
            </button>
            {filterPopup && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-[300px] p-4 max-h-[400px] overflow-y-auto z-50">
                <h3 className="text-sm font-semibold mb-3 text-purple-700">Filter</h3>
                <div>
                  <h4 className="font-medium mb-1 text-[#3A0CA3] text-sm">Location</h4>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto text-sm">
                    {locations.map(loc => (
                      <label key={loc} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-purple-50 text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={selectedLocations.includes(loc)} onChange={() => handleLocationToggle(loc)} className="accent-purple-600" />
                        <span>{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-4xl shadow-md border border-purple-100 mt-1">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#3A0CA3] text-white text-left uppercase text-l">
              <th className="px-4 sm:px-6 py-3">Report ID</th>
              <th className="px-4 sm:px-6 py-3">Reported by</th>
              <th className="px-4 sm:px-6 py-3">Item Name</th>
              <th className="hidden md:table-cell px-4 sm:px-6 py-3">Date Reported</th>
              <th className="hidden md:table-cell px-4 sm:px-6 py-3">Location</th>
              <th className="px-4 sm:px-6 py-3 text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map(item => (
                <tr key={item.lost_id} className="text-[#7209B7] border-t border-purple-100 hover:bg-purple-200 transition-colors">
                  <td className="px-4 sm:px-6 py-3">L{String(item.lost_id).padStart(4, '0')}</td>
                  <td className="px-4 sm:px-6 py-3">{item.reported_by}</td>
                  <td className="px-4 sm:px-6 py-3">{item.item_lost}</td>
                  <td className="hidden md:table-cell px-4 sm:px-6 py-3">{new Date(item.date_lost).toLocaleDateString()}</td>
                  <td className="hidden md:table-cell px-4 sm:px-6 py-3">{item.location_name}</td>
                  <td className="px-4 sm:px-6 py-3 text-center">
                    {activeTab === "Claimed" || activeTab === "Rejected" ? (
                      <SearchIcon 
                        className="w-4 h-4 cursor-pointer hover:opacity-70 inline" 
                        onClick={() => openModal(item)} 
                      />
                    ) : (
                      <Edit3 
                        className="w-4 h-4 cursor-pointer hover:opacity-70 inline" 
                        onClick={() => openModal(item)} 
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sortedData.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-[#7209B7] rounded-full disabled:opacity-50 text-sm">← Previous</button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-[#7209B7] rounded-full disabled:opacity-50 text-sm">Next →</button>
        </div>
      )}

      {/* Modals */}
      {renderActionModal()}
      {confirmOpen && (
        <ConfirmModal
          onClose={closeAllModals}
          onConfirm={handleApprove}
        />
      )}
      {rejectOpen && (
        <RejectModal
          reason={rejectReason}
          reviewedBy={currentUser ? `${currentUser.Fname} ${currentUser.Lname}` : ""}
          setReason={setRejectReason}
          onClose={closeAllModals}
          onConfirm={handleReject}
        />
      )}
      {successOpen && (
        <SuccessModal
          message={
            <div className="flex flex-col items-center gap-3">
              <BadgeCheck className="w-30 h-30 text-[#3A0CA3]" />
              <span className="text-[#7209B7]">{successMessage}</span>
            </div>
          }
          onClose={closeAllModals}
        />
      )}
    </div>
  );
}