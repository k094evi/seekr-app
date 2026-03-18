import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ClaimModal({ onBack, onNext }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onBack}></div>

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md bg-[#F7F5FF] rounded-3xl shadow-2xl p-10 text-center flex flex-col items-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-[#3A0CA3] w-30 h-30" />
        </div>

        <p className="text-[#7209B7] text-[15px] leading-relaxed mb-8">
          I acknowledge that all information provided in the following fields is
          truthful, appropriate, and is not intended for humor, satire, or any
          form of non-serious entry. Furthermore, in the case of a found item
          report, I confirm that the corresponding item has already been
          physically surrendered at the designated office or authorized
          personnel.
        </p>

        <div className="flex justify-center gap-6 w-full">
          <button
            onClick={onBack}
            className="bg-[#3A0CA3] text-[#E6DEFF] px-8 py-2 rounded-full hover:bg-purple-700 transition"
          >
            Close
          </button>
          <button
            onClick={onNext}
            className="bg-[#3A0CA3] text-[#E6DEFF] px-8 py-2 rounded-full hover:bg-purple-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}