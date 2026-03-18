import React from "react";

export default function RejectModal({
  reason,
  reviewedBy,
  setReason,
  onClose,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-10 bg-[#DEE1FF] rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        <h4 className="text-xl font-medium text-[#3A0CA3] mb-5">
          Please provide a specific reason for rejecting this report.
        </h4>
        <div className="flex flex-col gap-4 text-left mb-6">
          <label className="text-lg text-[#3A0CA3]">
            Reason
            <input
              type="text"
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white rounded-full px-4 py-2 mt-1 outline-none shadow-md"
            />
          </label>
          <label className="text-lg text-[#3A0CA3]">
            Reviewed by
            <input
              type="text"
              placeholder="Reviewer name"
              value={reviewedBy}
              disabled
              className="w-full bg-gray-100 rounded-full px-4 py-2 mt-1 outline-none shadow-md cursor-not-allowed text-gray-600"
            />
          </label>
        </div>
        <div className="flex justify-center gap-6">
          <button
            onClick={onClose}
            className="bg-[#3A0CA3] text-[#E6DEFF] px-8 py-2 rounded-full hover:bg-purple-700 transition"
          >
            Close
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#3A0CA3] text-[#E6DEFF] px-8 py-2 rounded-full hover:bg-purple-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}