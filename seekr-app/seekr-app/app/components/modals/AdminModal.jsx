import React, { useState, useEffect } from "react";
import { ShieldUser, Calendar } from "lucide-react";

export default function AdminModal({ onBack, onConfirm, reportId, lostReportId }) {
  const [formData, setFormData] = useState({
    dateClaimed: "",
    claimedBy: "",
    approvedBy: "",
    adminPassword: ""
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
      setFormData(prev => ({
        ...prev,
        approvedBy: `Admin ${user.Fname} ${user.Lname}`
      }));
      console.log("✅ Current admin user loaded:", user);
    } else {
      console.log("❌ No user found in localStorage");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
  };

  const handleConfirm = async () => {
    console.log("🔘 Confirm button clicked");
    
    // Validation
    if (!formData.dateClaimed || !formData.claimedBy || !formData.adminPassword) {
      setError("Please fill in all fields");
      console.log("❌ Validation failed - missing fields");
      return;
    }

    if (!currentUser) {
      setError("User session not found. Please log in again.");
      console.log("❌ No current user");
      return;
    }

    setIsSubmitting(true);

    // Format date as YYYY-MM-DD
    const formatDateForDB = (dateStr) => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    try {
      // Extract numeric ID from reportId (e.g., "F0001" -> "1")
      const numericId = reportId.replace('F', '').replace(/^0+/, '');

      // Choose endpoint based on whether we're linking to a lost report
      const endpoint = lostReportId 
        ? `http://localhost:5000/api/admin/found-reports/${numericId}/return-with-link`
        : `http://localhost:5000/api/admin/found-reports/${numericId}/return`;

      const requestBody = {
        claimed_by: formData.claimedBy,
        reviewed_by: currentUser.user_id,
        date_claimed: formatDateForDB(formData.dateClaimed),
        admin_password: formData.adminPassword
      };

      // Add lost_report_id if linking
      if (lostReportId) {
        requestBody.lost_report_id = lostReportId;
      }

      console.log("📤 Sending claim request:", {
        url: endpoint,
        body: {
          ...requestBody,
          admin_password: "***", // Hide password in logs
          lost_report_id: lostReportId || "none"
        }
      });

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      console.log("📥 Server response:", {
        status: response.status,
        success: data.success,
        error: data.error,
        message: data.message
      });

      setIsSubmitting(false);

      if (response.ok && data.success) {
        console.log("✅ Claim successful!");
        onConfirm(); // Call parent's confirm handler (shows success popup)
      } else {
        console.log("❌ Claim failed:", data.error);
        setError(data.error || "Failed to process claim");
      }
    } catch (error) {
      console.error("❌ Network error processing claim:", error);
      setError("Failed to process claim. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onBack}></div>

      {/* Modal box */}
      <div className="relative z-10 w-full max-w-2xl sm:max-w-lg md:max-w-xl bg-[#DEE1FF] rounded-3xl shadow-2xl p-6 sm:p-10 text-[#3A0CA3]">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* Icon */}
          <div className="flex-shrink-0 flex items-center justify-center w-full md:w-1/3">
            <ShieldUser 
              size={120} 
              className="text-[#3A0CA3] md:text-[#3A0CA3]" 
              strokeWidth={1.5} 
            />
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4 w-full md:w-2/3 text-base sm:text-lg">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-full text-sm">
                {error}
              </div>
            )}

            <label className="flex flex-col">
              Date Claimed
              <div className="relative">
                <input
                  type="date"
                  name="dateClaimed"
                  id="dateClaimed"
                  value={formData.dateClaimed}
                  onChange={handleChange}
                  className="rounded-full px-4 py-2 pr-10 bg-white border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#3A0CA3] w-full"
                  required
                />
                <Calendar 
                  size={20} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A0CA3] cursor-pointer" 
                  onClick={() => document.getElementById('dateClaimed').showPicker()}
                />
              </div>
            </label>

            <label className="flex flex-col">
              Claimed by
              <input
                type="text"
                name="claimedBy"
                value={formData.claimedBy}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="rounded-full px-4 py-2 bg-white border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#3A0CA3]"
                required
              />
            </label>

            <label className="flex flex-col">
              Approved by
              <input
                type="text"
                name="approvedBy"
                value={formData.approvedBy}
                readOnly
                className="rounded-full px-4 py-2 bg-gray-100 border border-gray-300 shadow-md cursor-not-allowed"
              />
            </label>

            <label className="flex flex-col">
              Admin Password
              <input
                type="password"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={handleChange}
                placeholder="Enter your password"
                className="rounded-full px-4 py-2 bg-white border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#3A0CA3]"
                required
              />
            </label>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-between mt-4 gap-3">
              <button
                onClick={onBack}
                disabled={isSubmitting}
                className="bg-[#3A0CA3] text-[#E6DEFF] px-8 py-2 rounded-full hover:bg-purple-700 transition w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="bg-[#3A0CA3] text-[#E6DEFF] px-8 py-2 rounded-full hover:bg-purple-700 transition w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}