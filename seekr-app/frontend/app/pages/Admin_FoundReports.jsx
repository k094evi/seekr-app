import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Search as SearchIcon,
  Edit3,
  BadgeCheck,
  Filter,
  SortAsc,
} from "lucide-react";


import PendingAction from "../components/PendingAction";
import ApprovedMissingAction from "../components/ApprovedMissingAction";
import ClaimedAction from "../components/ClaimedAction";
import RejectedAction from "../components/RejectedAction";
import ConfirmModal from "../components/modals/ConfirmModal";
import RejectModal from "../components/modals/RejectModal";
import SuccessModal from "../components/modals/SuccessModal";


const locations = [
  "Atrium", "Lobby", "Library", "Cafeteria", "Gymnasium", "Parking Area",
  "Computer Lab", "Nursing Lab", "Accounting Office", "Registrar's Office",
  "Guidance Office", "Student Center", "Admin Office", "Clinic", "Faculty Room",
  "AVR (Audio Visual Room)", "Stairs", "Comfort Room", "Multi Purpose Hall A",
  "Multi Purpose Hall B", "Multi Purpose Hall C", "Lecture Hall A",
  "Lecture Hall B", "Lecture Hall C", "Others",
];


// Helper function to format date as YYYY-MM-DD
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};


export default function Admin_FoundReports() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortPopup, setSortPopup] = useState(false);
  const [filterPopup, setFilterPopup] = useState(false);
  const [sortType, setSortType] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const sortRef = useRef(null);
  const filterRef = useRef(null);


  // State for backend data
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);


  // Modal states
  const [selectedReport, setSelectedReport] = useState(null);
  const [editedReport, setEditedReport] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [reason, setReason] = useState("");


  // Get current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
      console.log("✅ Current user loaded:", user);
    }
  }, []);


  // Fetch reports from backend
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
     
      if (activeTab === "Pending") params.append("status", "Pending");
      if (activeTab === "Approved Missing") params.append("status", "Approved Missing");
      if (activeTab === "Claimed") params.append("status", "Claimed");
      if (activeTab === "Rejected") params.append("status", "Rejected");


      const response = await fetch(
        `http://localhost:5000/api/admin/found-reports?${params.toString()}`
      );
      const data = await response.json();


      if (data.success) {
        setReports(data.data);
      } else {
        console.error("Failed to fetch reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);


  useEffect(() => {
    fetchReports();
  }, [fetchReports]);


  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortPopup(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Handle approve action with edited data
  const handleApprove = async () => {
    if (!selectedReport || !currentUser || !editedReport) {
      console.error("❌ Missing data:", { selectedReport, currentUser, editedReport });
      alert("Missing required data for approval");
      return;
    }


    const reportId = selectedReport.id.replace('F', '').replace(/^0+/, '');


    console.log("📤 Sending approval with edited data:", editedReport);


    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/found-reports/${reportId}/approve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewed_by: currentUser.user_id,
            editedData: editedReport
          }),
        }
      );


      const data = await response.json();
     
      console.log("📥 Server response:", data);
     
      if (data.success) {
        setSuccessMessage("The report has been approved with your changes.");
        closeAllModals();
        setSuccessOpen(true);
        // Refresh the data to remove the changed item
        await fetchReports();
      } else {
        alert(data.error || "Failed to approve report");
      }
    } catch (error) {
      console.error("Error approving report:", error);
      alert("Failed to approve report");
    }
  };


  // Handle reject action with edited data
  const handleReject = async () => {
    if (!selectedReport || !currentUser || !reason || !editedReport) {
      console.error("❌ Missing data");
      alert("Please provide a reason for rejection");
      return;
    }


    const reportId = selectedReport.id.replace('F', '').replace(/^0+/, '');


    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/found-reports/${reportId}/reject`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewed_by: currentUser.user_id,
            reason: reason,
            editedData: editedReport
          }),
        }
      );


      const data = await response.json();
     
      if (data.success) {
        setSuccessMessage("The report has been rejected.");
        closeAllModals();
        setSuccessOpen(true);
        setReason("");
        // Refresh the data to remove the changed item
        await fetchReports();
      } else {
        alert(data.error || "Failed to reject report");
      }
    } catch (error) {
      console.error("Error rejecting report:", error);
      alert("Failed to reject report");
    }
  };


  // Pagination logic with filtering and sorting
  // First, apply location filter
  const filteredReports = reports.filter(item => {
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(item.location);
    const matchesSearch = !searchQuery ||
      item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reportedBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocation && matchesSearch;
  });


  // Then, apply sorting
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortType === "Item Name (A-Z)") {
      return (a.itemName || "").localeCompare(b.itemName || "");
    }
    if (sortType === "Location (A-Z)") {
      return (a.location || "").localeCompare(b.location || "");
    }
    if (sortType === "Date (Newest to Oldest)") {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortType === "Date (Oldest to Newest)") {
      return new Date(a.date) - new Date(b.date);
    }
    return 0;
  });


  const totalPages = Math.max(1, Math.ceil(sortedReports.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedReports.slice(startIndex, startIndex + itemsPerPage);


  // Toggle handlers
  const handleLocationToggle = (loc) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
    setCurrentPage(1);
  };


  // Modal handlers
  const openActionModal = (report) => {
    setSelectedReport(report);
    setEditedReport(report);
    setActionModalOpen(true);
  };


  const closeAllModals = () => {
    setActionModalOpen(false);
    setConfirmOpen(false);
    setRejectOpen(false);
    setSelectedReport(null);
    setEditedReport(null);
    setReason("");
  };


  const handleOpenApprove = () => {
    setActionModalOpen(false);
    setConfirmOpen(true);
  };


  const handleOpenReject = () => {
    setActionModalOpen(false);
    setRejectOpen(true);
  };


  const handleCloseSuccess = () => {
    setSuccessOpen(false);
  };


  const handleReportUpdate = (updatedReport) => {
    setEditedReport(updatedReport);
  };


  // Enhanced refresh function that closes modals and updates data
  const handleRefreshAfterClaim = async () => {
    console.log("🔄 Refreshing data after claim...");
    closeAllModals(); // Close all modals immediately
    await fetchReports(); // Fetch updated data
    console.log("✅ Data refreshed successfully");
  };


  // Render action modal based on active tab
  const renderActionModal = () => {
    if (!selectedReport || !actionModalOpen) return null;
   
    const commonProps = {
      report: editedReport || selectedReport,
      onClose: closeAllModals,
      onApprove: handleOpenApprove,
      onReject: handleOpenReject,
      onReportUpdate: handleReportUpdate,
      onRefresh: handleRefreshAfterClaim, // Use enhanced refresh function
    };


    switch (activeTab) {
      case "Pending":
        return <PendingAction {...commonProps} />;
      case "Approved Missing":
        return <ApprovedMissingAction {...commonProps} />;
      case "Claimed":
        return <ClaimedAction report={selectedReport} onClose={closeAllModals} />;
      case "Rejected":
        return <RejectedAction report={selectedReport} onClose={closeAllModals} />;
      default:
        return null;
    }
  };


  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, sortType, selectedLocations, searchQuery]);


  return (
    <div className="min-h-screen text-[#3A0CA3] font-poppins p-4 sm:p-6">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative">
        <div className="flex items-center border border-purple-200 rounded-full px-3 py-2 bg-white w-full md:w-1/2 [box-shadow:inset_2.88px_2.88px_11.5px_0px_rgba(0,0,0,0.100),5.75px_5.75px_11.5px_0px_rgba(255,255,255,0.75)]">
          <SearchIcon className="w-4 h-4 text-purple-600 mr-2" />
          <input
            type="text"
            placeholder="Search items..."
            className="outline-none w-full text-sm text-[#3A0CA3] placeholder-[#3A0CA3]/60"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>


      {/* Tabs + Sort + Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {["Pending", "Approved Missing", "Claimed", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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


        {/* Sort + Filter */}
        <div className="flex items-center justify-end gap-2 mt-3 md:mt-0">
          {/* Sort Button */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => {
                setSortPopup(!sortPopup);
                setFilterPopup(false);
              }}
              className="p-2 rounded-md hover:bg-purple-100 text-purple-700"
              title="Sort"
            >
              <SortAsc size={20} />
            </button>
            {sortPopup && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-56 p-3 z-50">
                <h3 className="text-sm font-semibold mb-2 text-purple-700">Sort By</h3>
                {[
                  "Item Name (A-Z)",
                  "Location (A-Z)",
                  "Date (Newest to Oldest)",
                  "Date (Oldest to Newest)",
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortType(option);
                      setSortPopup(false);
                    }}
                    className="block w-full text-left p-2 rounded hover:bg-purple-100 text-gray-700 text-sm"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Filter Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => {
                setFilterPopup(!filterPopup);
                setSortPopup(false);
              }}
              className="p-2 rounded-md hover:bg-purple-100 text-purple-700"
              title="Filter"
            >
              <Filter size={20} />
            </button>


            {filterPopup && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-[300px] p-4 max-h-[400px] overflow-y-auto z-50">
                <h3 className="text-sm font-semibold mb-3 text-purple-700">Filter</h3>


                {/* Location Filter */}
                <div>
                  <h4 className="font-medium mb-1 text-[#3A0CA3] text-sm">Location</h4>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto text-sm">
                    {locations.map((loc) => (
                      <label
                        key={loc}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-purple-50 text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(loc)}
                          onChange={() => handleLocationToggle(loc)}
                          className="accent-purple-600"
                        />
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


      {/* Responsive Table */}
      <div className="overflow-x-auto bg-white rounded-4xl shadow-md border border-purple-100">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-[#3A0CA3] text-[#DCD6F7] uppercase text-l">
            <tr className="bg-[#3A0CA3] text-white text-left">
              <th className="px-3 sm:px-6 py-3">Report ID</th>
              <th className="px-3 sm:px-6 py-3">Reported by</th>
              <th className="px-3 sm:px-6 py-3">Item Name</th>
              <th className="px-3 sm:px-6 py-3">Date</th>
              <th className="px-3 sm:px-6 py-3">Location</th>
              <th className="px-3 sm:px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((item) => (
                <tr
                  key={item.id}
                  className="text-[#7209B7] border-t border-purple-100 hover:bg-purple-200 transition-colors"
                >
                  <td className="px-3 sm:px-6 py-3">{item.id}</td>
                  <td className="px-3 sm:px-6 py-3">{item.reportedBy}</td>
                  <td className="px-3 sm:px-6 py-3">{item.itemName}</td>
                  <td className="px-3 sm:px-6 py-3">{formatDate(item.date)}</td>
                  <td className="px-3 sm:px-6 py-3">{item.location}</td>
                  <td className="px-3 sm:px-6 py-3 text-center">
                    {activeTab === "Claimed" || activeTab === "Rejected" ? (
                      <SearchIcon
                        className="w-4 h-4 text-[#7209B7] cursor-pointer hover:opacity-70 inline"
                        onClick={() => openActionModal(item)}
                      />
                    ) : (
                      <Edit3
                        className="w-4 h-4 text-[#7209B7] cursor-pointer hover:opacity-70 inline"
                        onClick={() => openActionModal(item)}
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
      {sortedReports.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-4 mt-6 text-sm">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-2 bg-purple-100 hover:bg-purple-200 text-[#7209B7] rounded-full disabled:opacity-50"
          >
            ← Prev
          </button>
          <span className="text-[#3A0CA3]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 sm:px-4 py-2 bg-purple-100 hover:bg-purple-200 text-[#7209B7] rounded-full disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}


      {/* Modals */}
      {renderActionModal()}
     
      {confirmOpen && (
        <ConfirmModal
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleApprove}
        />
      )}
     
      {rejectOpen && currentUser && (
        <RejectModal
          reason={reason}
          reviewedBy={`${currentUser.Fname} ${currentUser.Lname}`}
          setReason={setReason}
          setReviewedBy={() => {}}
          onClose={() => {
            setRejectOpen(false);
            setReason("");
          }}
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
          onClose={handleCloseSuccess}
        />
      )}
    </div>
  );
}