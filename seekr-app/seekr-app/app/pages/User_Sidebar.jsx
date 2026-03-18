import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

export default function User_Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.user_id;

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${userId}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Poll notifications every 1 second
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 1000);
    return () => clearInterval(interval);
  }, [userId]);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter((n) => n.status?.toLowerCase() === "unread").length;
    setUnreadCount(count);
    localStorage.setItem("unreadCount", JSON.stringify(count));
  }, [notifications]);

  // Handle sidebar resize
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
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        unreadCount={unreadCount} // pass unreadCount to show badges in sidebar
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
