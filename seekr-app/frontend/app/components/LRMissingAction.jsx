import React, { useState } from "react";
import { Upload } from "lucide-react";


export default function LRMissingAction({
  report = {},
  onClose,
  onReject,
  editForm = {},
  setEditForm,
  isEditableTab = true,
}) {
  const [editImage, setEditImage] = useState(report?.image || null);


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>


      {/* MODAL WRAPPER — scrolls on small screens only */}
      <div
        className="
          relative z-10 w-full max-w-5xl bg-[#DEE1FF] rounded-3xl shadow-2xl p-8
          [box-shadow:inset_-1px_-1px_2px_0px_rgba(0,0,0,0.100),inset_1px_1px_2px_0px_rgba(0,0,0,0.100)]


          max-h-[90vh] overflow-y-auto
          md:max-h-none md:overflow-visible
        "
      >
        <div className="flex flex-col md:flex-row items-center gap-8">


          {/* Image Section */}
          <div className="flex justify-center items-center w-full md:w-1/2 bg-white rounded-3xl p-4 shadow-md">
            {report.image ? (
              <img
                src={report.image}
                alt="Item Preview"
                className="rounded-2xl w-full max-h-72 object-contain"
                onError={(e) => {
                  console.error("❌ Image failed to load:", report.image);
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
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 text-[#3A0CA3] text-lg">


            <label className="col-span-1">
              Item Name
              <input
                name="itemName"
                value={editForm.itemName || ""}
                onChange={handleEditChange}
                disabled={true}
                placeholder="e.g. Black Backpack"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Lost/Found
              <input
                name="lostFound"
                value={editForm.lostFound || "Lost"}
                onChange={handleEditChange}
                disabled={true}
                placeholder="Lost/Found"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Color
              <input
                name="color"
                value={editForm.color || ""}
                onChange={handleEditChange}
                disabled={true}
                placeholder="Color"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Brand
              <input
                name="brand"
                value={editForm.brand || ""}
                onChange={handleEditChange}
                disabled={true}
                placeholder="e.g. Nike"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-2">
              Other Notable Description
              <input
                name="description"
                value={editForm.description || ""}
                onChange={handleEditChange}
                disabled={true}
                placeholder="e.g. Has a keychain attached"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Location
              <input
                name="location"
                value={editForm.location || ""}
                onChange={handleEditChange}
                disabled={true}
                placeholder="Location"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Location Description
              <input
                name="locationDescription"
                value={editForm.locationDescription || ""}
                onChange={handleEditChange}
                disabled={true}
                placeholder="e.g. Near the reception desk"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Date Reported
              <input
                type="date"
                name="date"
                id="dateReported"
                value={editForm.date || ""}
                onChange={handleEditChange}
                disabled={true}
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none text-[#3A0CA3]"
              />
            </label>


            <label className="col-span-1">
              Reported By
              <input
                name="reportedBy"
                value={editForm.reportedBy || ""}
                onChange={handleEditChange}
                disabled={true}
                placeholder="e.g. John Doe"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            {/* ACTION BUTTONS */}
            <div className="col-span-2 flex justify-end items-center gap-2 mt-4">
              {isEditableTab && (
                <>
                  <button
                    onClick={onReject}
                    className="bg-[#3A0CA3] text-[#E6DEFF] px-5 py-1.5 rounded-full hover:bg-purple-700 transition"
                  >
                    Reject
                  </button>
                </>
              )}


              <button
                onClick={onClose}
                className="bg-[#3A0CA3] text-[#E6DEFF] px-5 py-1.5 rounded-full hover:bg-purple-700 transition"
              >
                Cancel
              </button>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

