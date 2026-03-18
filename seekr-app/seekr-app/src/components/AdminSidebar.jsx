import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/seekr-logo.png";
import { LayoutDashboard, FileSearch, FileX, Bell, Upload, Settings, LogOut } from "lucide-react";

export default function AdminSidebar({ isSidebarOpen, toggleSidebar, unreadCount }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin_sidebar/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Found Reports", path: "/admin_sidebar/found", icon: <FileSearch size={18} /> },
    { name: "Lost Reports", path: "/admin_sidebar/lost", icon: <FileX size={18} /> },
    {
      name: "Notifications",
      path: "/admin_sidebar/notifications",
      icon: <Bell size={18} />,
      badge: unreadCount, 
    },
    { name: "Upload Report", path: "/admin_sidebar/upload", icon: <Upload size={18} /> },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLogoutPopup(true);
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/admin_sidebar/settings");
    if (window.innerWidth < 768) toggleSidebar();
  };
  
  const confirmLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 md:w-56 
          bg-[#DCD6F7] shadow-lg flex flex-col justify-between p-4 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <div className="flex justify-center items-center gap-2 mb-8">
          <img src={logo} alt="Seekr Logo" className="w-16 h-16 object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => window.innerWidth < 768 && toggleSidebar()}
              className={`flex items-center justify-between p-4 rounded-full font-medium transition
                ${
                  location.pathname === item.path
                    ? "bg-purple-600 text-white"
                    : "bg-white text-[#3A0CA3] hover:bg-purple-300"
                }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.name}
              </div>

              {/* Badge for notifications */}
              {item.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Settings + Logout */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-violet-600 font-medium hover:text-violet-800 transition"
          >
            <LogOut size={18} /> Logout
          </button>
          <button
            type="button"
            onClick={handleSettingsClick}
            className={`flex items-center gap-2 text-violet-600 font-medium hover:text-violet-800 transition ${
              location.pathname === "/admin_sidebar/settings" ? "text-violet-800 font-semibold" : ""
            }`}
          >
            <Settings size={18} /> Settings
          </button>
        </div>
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
                onClick={() => setShowLogoutPopup(false)}
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