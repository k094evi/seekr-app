import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/seekr-logo.png";
import { PackageSearch, History, Bell, Upload, LogOut } from "lucide-react";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const navItems = [
    { name: "Missing Items", path: "/User_Sidebar/missing", icon: <PackageSearch size={18} /> },
    { name: "History", path: "/User_Sidebar/history", icon: <History size={18} /> },
    { name: "Notifications", path: "/User_Sidebar/notifications", icon: <Bell size={18} /> },
    { name: "Upload Report", path: "/User_Sidebar/upload", icon: <Upload size={18} /> },
  ];

  const handleLogout = () => setShowLogoutPopup(true);
  const confirmLogout = () => {
    setShowLogoutPopup(false);
    localStorage.removeItem("user");
    navigate("/login");
  };
  const cancelLogout = () => setShowLogoutPopup(false);

  return (
    <>
      {/* Sidebar Container */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 md:w-56 
          bg-[#DCD6F7] shadow-lg flex flex-col justify-between p-4 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex justify-center items-center gap-2 mb-8">
          <img src={logo} alt="Seekr Logo" className="w-16 h-16 object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isNotifications = item.name === "Notifications";
            const unreadCount = JSON.parse(localStorage.getItem("unreadCount")) || 0;
            const isActive = location.pathname === item.path || 
                           (location.pathname === "/User_Sidebar" && item.path === "/User_Sidebar/missing");

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
                className={`flex items-center justify-between gap-3 p-4 rounded-full font-medium transition
                  [box-shadow:inset_-1px_-1px_2px_rgba(0,0,0,0.25),
                  inset_1px_1px_2px_rgba(0,0,0,0.25),
                  5px_5px_10px_rgba(220,214,247,0.25)]
                  ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "bg-white text-[#3A0CA3] hover:bg-purple-300"
                  }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.name}
                </div>
                {isNotifications && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-violet-600 font-medium hover:text-violet-800 transition mt-8"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center w-80">
            <h2 className="text-lg font-semibold text-[#3A0CA3] mb-4">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Yes
              </button>
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}