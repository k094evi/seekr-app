import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { Menu } from "lucide-react";

export default function Admin_Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/admin/notifications/`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 1000); // optional polling every 1s
    return () => clearInterval(interval);
  }, []);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter((n) => n.status === "unread").length;
    setUnreadCount(count);
    localStorage.setItem("unreadCount", JSON.stringify(count));
  }, [notifications]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen h-screen bg-gray-50 overflow-hidden relative">
      {/* Sidebar */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        unreadCount={unreadCount}
      />

      {/* Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-[#3A0CA3]"
      >
        <Menu size={24} />
      </button>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto h-screen md:h-auto">
        <Outlet />
      </main>
    </div>
  );
}
