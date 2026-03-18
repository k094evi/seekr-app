import React from "react";

export default function SuccessModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
        {/* Changed <p> to <div> so we can pass JSX safely */}
        <div className="text-[#7209B7] font-semibold mb-4">{message}</div>
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
