import React, { useState, useEffect } from "react";
import { Search, CheckCircle, Circle, Trash2, MailOpen } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

const storedUser = JSON.parse(localStorage.getItem("user"));
const userId = storedUser?.user_id;

  // 🟣 Fetch notifications from backend
  const fetchNotifications = async () => {
  if (!userId) return;
  try {
    const response = await fetch(`http://localhost:5000/api/notifications/${userId}`);
    const data = await response.json();

    // Filter out empty messages and map read status
    const cleanedNotifications = data
      .filter((n, index, self) => 
        index === self.findIndex(t => t.notification_id === n.notification_id)
      )
      .map((n) => ({
        id: n.notification_id,
        message: n.message,
        date: new Date(n.created_at).toLocaleDateString(),
        time: new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: n.status?.toLowerCase() === "read",
      }));

    setNotifications(cleanedNotifications);
      const unreadCount = cleanedNotifications.filter((n) => !n.read).length;
      localStorage.setItem("unreadCount", JSON.stringify(unreadCount));
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
  }
};

  useEffect(() => {
  // Fetch initially
  fetchNotifications();

  // Refetch when tab/window gains focus
  const handleFocus = () => {
    fetchNotifications();
    
  };

  window.addEventListener("focus", handleFocus);

  return () => {
    window.removeEventListener("focus", handleFocus);
  };
}, []);


  // 🟢 Update unread count in localStorage
  useEffect(() => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    localStorage.setItem("unreadCount", JSON.stringify(unreadCount));
  }, [notifications]);

  // 🟡 Mark all as read (sync with backend)
  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.read)
          .map((n) =>
            fetch(`http://localhost:5000/api/notifications/${n.id}/read`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
            })
          )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // 🔴 Delete all notifications (sync with backend)
  const deleteAll = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all notifications?");
    if (!confirmDelete) return;
    try {
      await fetch(`http://localhost:5000/api/notifications/user/${userId}`, {
        method: "DELETE",
      });
      setNotifications([]);
    } catch (err) {
      console.error("Failed to delete notifications:", err);
    }
  };

  // 🔴 Toggle single read/unread (sync with backend)
  const toggleRead = async (id, currentlyRead) => {
    try {
      // Decide which endpoint or payload to call
      const endpoint = currentlyRead
        ? `http://localhost:5000/api/notifications/${id}/unread` // mark as unread
        : `http://localhost:5000/api/notifications/${id}/read`;  // mark as read

      await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      // Update local state immediately
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.id === id ? { ...n, read: !currentlyRead } : n
        );

        // Update unread count in localStorage
        const unreadCount = updated.filter((n) => !n.read).length;
        localStorage.setItem("unreadCount", JSON.stringify(unreadCount));

        return updated;
      });
    } catch (err) {
      console.error("Failed to toggle read/unread status:", err);
    }
  };

  // 🔍 Search + Pagination
  const filtered = notifications.filter((n) =>
    n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 justify-center px-4">
      <main className="flex-1 max-w-6xl w-full p-8">
        <h2 className="text-4xl font-semibold text-[#3A0CA3] mb-6">
          Notifications
        </h2>

        {/* Search + Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <div className="flex items-center border border-purple-200 rounded-full px-3 py-2 bg-white w-full md:w-1/2 [box-shadow:inset_2.88px_2.88px_11.5px_0px_rgba(0,0,0,0.100),5.75px_5.75px_11.5px_0px_rgba(255,255,255,0.75)]">
            <Search size={18} className="text-purple-600 mr-2" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2 mt-3 md:mt-0 w-full md:w-auto">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-[#DCD6F7] bg-[#3A0CA3] hover:text-[#3A0CA3] hover:bg-purple-200 rounded-full font-medium [box-shadow:inset_-1px_-1px_2px_0px_rgba(0,0,0,0.25),inset_1px_1px_2px_0px_rgba(0,0,0,0.25),18px_18px_20px_0px_rgba(199,199,199,0.25),-18px_-18px_20px_0px_rgba(199,199,199,0.25)]"
            >
              <MailOpen size={18} /> Mark All as Read
            </button>
            <button
              onClick={deleteAll}
              className="flex items-center gap-2 px-4 py-2 text-[#DCD6F7] bg-[#3A0CA3] hover:text-[#3A0CA3] hover:bg-purple-200 rounded-full font-medium [box-shadow:inset_-1px_-1px_2px_0px_rgba(0,0,0,0.25),inset_1px_1px_2px_0px_rgba(0,0,0,0.25),18px_18px_20px_0px_rgba(199,199,199,0.25),-18px_-18px_20px_0px_rgba(199,199,199,0.25)]"
            >
              <Trash2 size={18} /> Delete All
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-4xl shadow-md border border-purple-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#3A0CA3] text-[#DCD6F7] uppercase text-l">
              <tr>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((n) => (
                <tr
                  key={n.id}
                  onClick={() => toggleRead(n.id, n.read)}
                  className={`text-[#7209B7] cursor-pointer border-t border-purple-100 transition-colors ${
                    n.read
                      ? "bg-gray-50 text-gray-600 hover:bg-purple-50"
                      : "bg-white font-semibold hover:bg-purple-100"
                  }`}
                >
                  <td className="px-6 py-3">
                    {n.read ? (
                      <CheckCircle className="text-green-500" size={18} />
                    ) : (
                      <Circle className="text-purple-500" size={18} />
                    )}
                  </td>
                  <td className="px-6 py-3">{n.message}</td>
                  <td className="px-6 py-3">{n.date}</td>
                  <td className="px-6 py-3">{n.time}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                    No notifications available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-[#7209B7] rounded-full disabled:opacity-50"
            >
              ← Previous
            </button>
            <span className="text-sm text-[#3A0CA3]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-[#7209B7] rounded-full disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}