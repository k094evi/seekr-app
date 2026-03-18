import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";

export default function Admin_Settings() {
  // Show/hide password toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Popups
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Personalization input fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  // Security input fields
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load current user info from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFirstName(user.Fname || "");
      setMiddleName(user.Mname || "");
      setLastName(user.Lname || "");
      setEmail(user.email || "");
    }
  }, []);

  // Save name changes popup
  const handleSaveChanges = () => {
    setShowConfirmPopup(true);
  };

  // Password update popup
  const handlePasswordUpdate = () => {
    if (!currentPassword) {
      setSuccessMessage("Please enter your current password!");
      setIsError(true);
      setShowSuccess(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setSuccessMessage("New password and confirm password do not match!");
      setIsError(true);
      setShowSuccess(true);
      return;
    }

    setShowPasswordPopup(true);
  };

  // Confirm name update
  const confirmSaveChanges = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.user_id;

    try {
      await axios.put(`http://localhost:5000/api/users/update-info/${userId}`, {
        fname_user: firstName,
        mname_user: middleName,
        lname_user: lastName,
      });

      setShowConfirmPopup(false);
      setSuccessMessage("You have successfully changed your name!");
      setIsError(false);
      setShowSuccess(true);

      // Update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, Fname: firstName, Mname: middleName, Lname: lastName })
      );
    } catch (err) {
      setSuccessMessage("Failed to update name. Try again.");
      setIsError(true);
      setShowSuccess(true);
    }
  };

  // Confirm password update
  const confirmPasswordChange = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.user_id;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/update-password/${userId}`,
        {
          email_user: email,
          currentPassword,
          newPassword,
        }
      );

      if (response.data.success) {
        setShowPasswordPopup(false);
        setSuccessMessage("You have successfully changed your password!");
        setIsError(false);
        setShowSuccess(true);

        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Incorrect password or other errors
        setSuccessMessage(response.data.message || "Incorrect current password!");
        setIsError(true);
        setShowSuccess(true);
        setCurrentPassword(""); // always clear current password
      }
    } catch (err) {
      setSuccessMessage(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      setIsError(true);
      setShowSuccess(true);
      setCurrentPassword(""); // always clear current password
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen text-[#3A0CA3] font-poppins px-4 sm:px-6 md:px-10 py-8 overflow-y-auto">
      <h2 className="text-4xl font-semibold text-[#3A0CA3] mb-6 text-center md:text-left">
        Settings
      </h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
        {/* Personalization Section */}
        <section className="shadow-md rounded-3xl border border-[#3A0CA3]/10 p-6 sm:p-8">
          <h2 className="font-semibold text-[#3A0CA3] text-lg sm:text-xl mb-6">
            Personalization
          </h2>

          <div className="flex flex-col gap-2">
            <div>
              <label className="text-sm sm:text-base text-[#3A0CA3] block mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-white border-[#3A0CA3]/10 rounded-full px-4 py-2 mt-1 outline-none shadow-md"
              />
            </div>

            <div>
              <label className="text-sm sm:text-base text-[#3A0CA3] block mb-1">
                Middle Name
              </label>
              <input
                type="text"
                placeholder="Enter middle name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full bg-white border-[#3A0CA3]/10 rounded-full px-4 py-2 mt-1 outline-none shadow-md"
              />
            </div>

            <div>
              <label className="text-sm sm:text-base text-[#3A0CA3] block mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-white border-[#3A0CA3]/10 rounded-full px-4 py-2 mt-1 outline-none shadow-md"
              />
            </div>
          </div>

          <button
            onClick={handleSaveChanges}
            className="mt-6 bg-gradient-to-r from-[#3A0CA3] to-[#3A0CA3]/80 text-white py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:opacity-90 transition w-full shadow-md"
          >
            Save Changes
          </button>
        </section>

        {/* Security Section */}
        <section className="shadow-md rounded-3xl border border-[#3A0CA3]/10 p-6 sm:p-8">
          <h2 className="font-semibold text-[#3A0CA3] text-lg sm:text-xl mb-6">
            Security
          </h2>

          <div className="flex flex-col gap-2">
            {/* Email Field */}
            <div>
              <label className="text-sm sm:text-base text-[#3A0CA3] block mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border-[#3A0CA3]/10 rounded-full px-4 py-2 mt-1 outline-none shadow-md"
              />
            </div>

            {/* Current Password */}
            <div className="relative">
              <label className="text-sm sm:text-base text-[#3A0CA3] block mb-1">
                Current Password
              </label>
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-white border-[#3A0CA3]/10 rounded-full px-4 py-2 mt-1 outline-none shadow-md pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-9 text-[#3A0CA3] hover:opacity-70"
              >
                {showCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="text-sm sm:text-base text-[#3A0CA3] block mb-1">
                New Password
              </label>
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white border-[#3A0CA3]/10 rounded-full px-4 py-2 mt-1 outline-none shadow-md pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-9 text-[#3A0CA3] hover:opacity-70"
              >
                {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="text-sm sm:text-base text-[#3A0CA3] block mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border-[#3A0CA3]/10 rounded-full px-4 py-2 mt-1 outline-none shadow-md pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-9 text-[#3A0CA3] hover:opacity-70"
              >
                {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <button
              onClick={handlePasswordUpdate}
              className="mt-4 bg-gradient-to-r from-[#3A0CA3] to-[#3A0CA3]/80 text-white py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:opacity-90 transition w-full shadow-md"
            >
              Update Password
            </button>
          </div>
        </section>
      </div>

      {/* Name Change Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
            <p className="text-[#3A0CA3] text-lg font-semibold mb-4">
              Are you sure you want to save these changes?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSaveChanges}
                className="bg-[#3A0CA3] text-[#E6DEFF] px-5 py-1.5 rounded-full hover:bg-purple-700 transition"
              >
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Confirmation Popup */}
      {showPasswordPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
            <p className="text-[#3A0CA3] font-medium mb-4">
              Are you sure you want to change your password?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPasswordPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmPasswordChange}
                className="bg-[#3A0CA3] text-[#E6DEFF] px-5 py-1.5 rounded-full hover:bg-purple-700 transition"
              >
                Yes, Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
            {isError ? (
              <AlertTriangle className="mx-auto text-[#3A0CA3] mb-3" size={60} />
            ) : (
              <CheckCircle className="mx-auto text-[#3A0CA3] mb-3" size={60} />
            )}
            <p className="text-[#3A0CA3] font-medium mb-4">{successMessage}</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-[#3A0CA3] text-[#E6DEFF] px-5 py-1.5 rounded-full hover:bg-purple-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}