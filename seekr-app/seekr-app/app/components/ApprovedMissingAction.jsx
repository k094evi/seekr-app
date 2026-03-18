import React, { useState } from "react";
import { Upload, BadgeCheck, Calendar } from "lucide-react";
import ClaimModal from "../components/modals/ClaimModal";
import AdminModal from "../components/modals/AdminModal";


function SuccessPopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-10 bg-[#F9F9FA] rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        <BadgeCheck className="w-30 h-30 mx-auto text-[#3A0CA3]" size={100} />
        <p className="text-[#7209B7] mt-4 mb-6 font-medium">
          The item has been claimed.
        </p>
        <button
          onClick={onClose}
          className="bg-[#3A0CA3] text-[#E6DEFF] px-8 py-2 rounded-full hover:bg-purple-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}


export default function ApprovedMissingAction({ report, onClose, onReportUpdate, onRefresh }) {
  const [editForm, setEditForm] = useState({ ...report });
  const [editImage] = useState(report.image || null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isReportedLost, setIsReportedLost] = useState(false);
  const [lostReportInput, setLostReportInput] = useState("");
  const [lostReportData, setLostReportData] = useState(null);
  const [loadingLostReport, setLoadingLostReport] = useState(false);
  const [lostReportError, setLostReportError] = useState("");


  const colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet", "Black", "White", "Others"];
  const locations = [
    "Atrium", "Lobby", "Library", "Cafeteria", "Gymnasium", "Parking Area",
    "Computer Lab", "Nursing Lab", "Accounting Office", "Registrar's Office",
    "Guidance Office", "Student Center", "Admin Office", "Clinic", "Faculty Room",
    "AVR (Audio Visual Room)", "Stairs", "Comfort Room", "Multi Purpose Hall A",
    "Multi Purpose Hall B", "Multi Purpose Hall C", "Lecture Hall A",
    "Lecture Hall B", "Lecture Hall C", "Others"
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...editForm, [name]: value };
    setEditForm(updatedForm);


    if (onReportUpdate) {
      onReportUpdate(updatedForm);
    }
  };


  const handleClaimClick = () => setShowClaimModal(true);
  const handleBackFromClaim = () => setShowClaimModal(false);
  const handleNextFromClaim = () => {
    setShowClaimModal(false);
    setShowAdminModal(true);
  };
  const handleBackFromAdmin = () => {
    setShowAdminModal(false);
    setShowClaimModal(true);
  };
  const handleConfirmAdmin = () => {
    setShowAdminModal(false);
    setShowSuccessPopup(true);
  };
  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => {
      onClose();
    }, 100);
  };


  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsReportedLost(checked);
    if (!checked) {
      setLostReportInput("");
      setLostReportData(null);
      setLostReportError("");
      const updatedForm = { ...editForm, reportID: "" };
      setEditForm(updatedForm);
      if (onReportUpdate) {
        onReportUpdate(updatedForm);
      }
    }
  };


  const handleReportIDChange = async (e) => {
    const value = e.target.value;
    setLostReportInput(value);
    setLostReportError("");
    setLostReportData(null);


    if (!value.trim()) {
      const updatedForm = { ...editForm, reportID: "" };
      setEditForm(updatedForm);
      if (onReportUpdate) {
        onReportUpdate(updatedForm);
      }
      return;
    }


    const numericId = value.replace(/[^0-9]/g, '');
    if (!numericId) {
      setLostReportError("Invalid Report ID format");
      return;
    }


    setLoadingLostReport(true);


    try {
      const response = await fetch(`http://localhost:5000/api/lost-reports/${numericId}`);
      const data = await response.json();


      if (response.ok) {
        if (data.status !== 'missing') {
          const reportId = `L${String(numericId).padStart(4, '0')}`;
          const statusText = data.status.charAt(0).toUpperCase() + data.status.slice(1);
          setLostReportError(`The report ${reportId} is in ${statusText}`);
          setLoadingLostReport(false);
          return;
        }


        setLostReportData(data);
        const updatedForm = { ...editForm, reportID: `L${String(numericId).padStart(4, '0')}` };
        setEditForm(updatedForm);
        if (onReportUpdate) {
          onReportUpdate(updatedForm);
        }
      } else {
        setLostReportError(data.error || "Report not found");
      }
    } catch (error) {
      console.error("Error fetching lost report:", error);
      setLostReportError("Failed to fetch report");
    } finally {
      setLoadingLostReport(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>


      <div className="relative z-10 w-full max-w-5xl bg-[#DEE1FF] rounded-3xl shadow-2xl p-8 my-10
        max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row items-start gap-8">
         
          {/* IMAGE SECTION */}
          <div className="flex justify-center items-center w-full md:w-1/2 bg-white rounded-3xl p-4 shadow-md self-center">
            {editImage ? (
              <img
                src={editImage}
                alt="Item Preview"
                className="rounded-2xl w-full max-h-72 object-contain"
                onError={(e) => {
                  console.error("❌ Image failed to load:", editImage);
                  e.target.style.display = "none";
                  const placeholder =
                    e.target.nextElementSibling || document.createElement("div");
                  placeholder.className =
                    "w-full h-60 flex flex-col justify-center items-center border-2 border-dashed border-purple-400 rounded-2xl";
                  placeholder.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p class="text-sm text-purple-600 font-medium mt-2">Image not available</p>
                  `;
                  if (!e.target.nextElementSibling) {
                    e.target.parentElement.appendChild(placeholder);
                  }
                }}
              />
            ) : (
              <div className="w-full h-60 flex flex-col justify-center items-center border-2 border-dashed border-purple-400 rounded-2xl">
                <Upload className="text-purple-500" size={32} />
                <p className="text-sm text-purple-600 font-medium mt-2">
                  No image uploaded
                </p>
              </div>
            )}
          </div>


          {/* FORM SECTION */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-[#3A0CA3] text-lg">
              <label className="col-span-1">
                Item Name
                <input
                  name="itemName"
                  value={editForm.itemName || ""}
                  onChange={handleChange}
                  placeholder="e.g. Black Umbrella"
                  className="h-[35px] border p-2 rounded-full w-full bg-gray-100 outline-none cursor-default"
                  readOnly
                />
              </label>
              <label className="col-span-1">
                Lost/Found
                <select
                  name="lostFound"
                  value={editForm.lostFound || ""}
                  onChange={handleChange}
                  className="h-[35px] border p-2 rounded-full w-full bg-gray-100 outline-none cursor-default"
                  disabled
                >
                  <option value="">Select</option>
                  <option>Lost</option>
                  <option>Found</option>
                </select>
              </label>


              <label className="col-span-1">
                Color
                <select
                  name="color"
                  value={editForm.color || ""}
                  onChange={handleChange}
                  className="h-[35px] border p-2 rounded-full w-full bg-gray-100 outline-none cursor-default"
                  disabled
                >
                  <option value="">Select Color</option>
                  {colors.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="col-span-1">
                Brand
                <input
                  name="brand"
                  value={editForm.brand || ""}
                  onChange={handleChange}
                  placeholder="e.g. Nike, Samsung"
                  className="h-[35px] border p-2 rounded-full w-full bg-gray-100 outline-none cursor-default"
                  readOnly
                />
              </label>


              <label className="col-span-2">
                Other Notable Description
                <input
                  name="description"
                  value={editForm.description || ""}
                  onChange={handleChange}
                  placeholder="e.g. Has a keychain attached"
                  className="h-[35px] border p-2 rounded-full w-full bg-gray-100 outline-none cursor-default"
                  readOnly
                />
              </label>


              <label className="col-span-1">
                Location
                <select
                  name="location"
                  value={editForm.location || ""}
                  onChange={handleChange}
                  className="h-[35px] border p-2 rounded-full w-full bg-gray-100 outline-none cursor-default"
                  disabled
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc}>{loc}</option>
                  ))}
                </select>
              </label>
              <label className="col-span-1">
                Location Description
                <input
                  name="locationDescription"
                  value={editForm.locationDescription || ""}
                  onChange={handleChange}
                  placeholder="e.g. Near the front desk"
                  className="h-[35px] border p-2 rounded-full w-full bg-gray-100 outline-none cursor-default"
                  readOnly
                />
              </label>


              <label className="col-span-1 relative">
                Date Reported
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={editForm.date || ""}
                    onChange={handleChange}
                    className="h-[35px] border p-2 pr-10 rounded-full w-full bg-gray-100 outline-none cursor-default"
                    readOnly
                  />
                  <Calendar
                    size={18}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </label>
              <label className="col-span-1">
                Reported By
                <input
                  name="reportedBy"
                  value={editForm.reportedBy || ""}
                  onChange={handleChange}
                  placeholder="e.g. Juan Dela Cruz"
                  className="h-[35px] border p-2 rounded-full w-full bg-gray-100 outline-none cursor-default"
                  readOnly
                />
              </label>


              <label className="col-span-1">
                Reviewed By
                <input
                  name="reviewedBy"
                  value={editForm.reviewedBy || ""}
                  onChange={handleChange}
                  placeholder="e.g. Admin Officer"
                  className="h-[35px] border p-2 rounded-full w-full bg-gray-100 outline-none cursor-default"
                  readOnly
                />
              </label>


              <label className="col-span-1">
                Lost Report ID
                <input
                  type="text"
                  value={lostReportInput}
                  onChange={handleReportIDChange}
                  placeholder="e.g. L0001 or 1"
                  disabled={!isReportedLost}
                  className="h-[35px] border p-2 rounded-full w-full bg-white outline-none disabled:bg-gray-100 disabled:cursor-default"
                />
              </label>
            </div>


            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reportedLost"
                checked={isReportedLost}
                onChange={handleCheckboxChange}
                className="w-4 h-4 accent-[#3A0CA3]"
              />
              <label htmlFor="reportedLost" className="text-lg text-[#3A0CA3]">
                Link to Lost Report
              </label>
            </div>


            {/* Only show lost report section if checkbox checked AND input is not empty */}
            {isReportedLost && lostReportInput.trim() && (
              <div className="max-h-40 overflow-y-auto space-y-2 bg-white p-2 rounded-lg shadow-inner">
                {loadingLostReport && (
                  <p className="text-sm text-blue-600">Loading report...</p>
                )}
               
                {lostReportError && (
                  <p className="text-sm text-red-600">{lostReportError}</p>
                )}
               
                {lostReportData && (
                  <div className="p-3 text-sm">
                    <p className="text-green-700 font-semibold mb-2">✓ Lost Report Found</p>
                    <div className="space-y-1 text-gray-700">
                      <p><strong>Item:</strong> {lostReportData.item_lost}</p>
                      <p><strong>Reported by:</strong> {lostReportData.reported_by}</p>
                      <p><strong>Location:</strong> {lostReportData.location_name}</p>
                      <p><strong>Date:</strong> {new Date(lostReportData.date_lost).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}


            <div className="flex justify-end items-center gap-4 pt-4">
              <button
                onClick={onClose}
                className="bg-[#3A0CA3] text-[#E6DEFF] px-5 py-1.5 rounded-full hover:bg-purple-700 transition"
              >
                Close
              </button>
              <button
                onClick={handleClaimClick}
                className="bg-[#3A0CA3] text-[#E6DEFF] px-5 py-1.5 rounded-full hover:bg-purple-700 transition"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>


      {showClaimModal && (
        <ClaimModal onBack={handleBackFromClaim} onNext={handleNextFromClaim} />
      )}
      {showAdminModal && (
        <AdminModal
          reportId={report.id}
          lostReportId={lostReportData ? lostReportData.lost_id : null}
          onBack={handleBackFromAdmin}
          onConfirm={handleConfirmAdmin}
        />
      )}
      {showSuccessPopup && <SuccessPopup onClose={handleClosePopup} />}
    </div>
  );
}