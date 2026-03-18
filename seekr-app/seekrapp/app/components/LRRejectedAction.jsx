import React from "react";
import { Upload } from "lucide-react";


// Helper function to format date as YYYY-MM-DD
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


export default function LRRejectedAction({ report, onClose }) {
  if (!report) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      ></div>


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


          {/* Info Section */}
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 text-[#3A0CA3] text-lg">
            <label className="col-span-1">
              Item Name
              <input
                disabled
                value={report.itemName || ""}
                placeholder="e.g. Black Umbrella"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Lost/Found
              <input
                disabled
                value={report.lostFound || "Lost"}
                placeholder="Select"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Color
              <input
                disabled
                value={report.color || ""}
                placeholder="Select Color"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Brand
              <input
                disabled
                value={report.brand || ""}
                placeholder="e.g. Nike, Samsung"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-2">
              Other Notable Description
              <input
                disabled
                value={report.description || ""}
                placeholder="e.g. Has a keychain attached"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Location
              <input
                disabled
                value={report.location || ""}
                placeholder="Select Location"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Location Description
              <input
                disabled
                value={report.locationDescription || ""}
                placeholder="e.g. Near the front desk"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Date Reported
              <input
                disabled
                value={formatDate(report.date) || ""}
                placeholder="dd/mm/yyyy"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Reported by
              <input
                disabled
                value={report.reportedBy || ""}
                placeholder="e.g. Juan Dela Cruz"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Reviewed by
              <input
                disabled
                value={report.reviewedBy || ""}
                placeholder="e.g. Admin Officer"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <label className="col-span-1">
              Reason
              <input
                disabled
                value={report.reason || ""}
                placeholder="e.g. Invalid details or mismatch"
                className="h-[35px] border p-2 rounded-full w-full bg-white outline-none"
              />
            </label>


            <div className="col-span-2 flex justify-end mt-4">
              <button
                onClick={onClose}
                className="bg-[#3A0CA3] text-[#E6DEFF] px-5 py-1.5 rounded-full hover:bg-purple-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

