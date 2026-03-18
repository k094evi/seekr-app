import React, { useState, useEffect } from "react";
import { Search, CheckCircle, Circle, Trash2, MailOpen } from "lucide-react";

export default function Admin_Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all global notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/admin/notifications/`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Initial fetch + polling every 10 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  // Update unread count whenever notifications change
  useEffect(() => {
    const unreadCount = notifications.filter((n) => n.status === "unread").length;
    localStorage.setItem("unreadCount", JSON.stringify(unreadCount));
  }, [notifications]);

  // Toggle read/unread for a single notification
  const toggleRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/admin/notifications/toggle-read/${id}`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: n.status === "read" ? "unread" : "read" } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await fetch(`http://localhost:5000/admin/notifications/mark-all`, { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete all notifications
  const deleteAll = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all notifications?");
    if (!confirmDelete) return;
    try {
      await fetch(`http://localhost:5000/admin/notifications/delete-all`, { method: "DELETE" });
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter notifications based on search query
  const filtered = notifications.filter((n) =>
    n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 justify-center px-4">
      <main className="flex-1 max-w-6xl w-full p-8">
        <h2 className="text-4xl font-semibold text-[#3A0CA3] mb-6">Notifications</h2>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <div className="flex items-center border border-purple-200 rounded-full px-3 py-2 bg-white w-full md:w-1/2">
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
              className="flex items-center gap-2 px-4 py-2 text-[#DCD6F7] bg-[#3A0CA3] hover:text-[#3A0CA3] hover:bg-purple-200 rounded-full font-medium"
            >
              <MailOpen size={18} /> Mark All as Read
            </button>
            <button
              onClick={deleteAll}
              className="flex items-center gap-2 px-4 py-2 text-[#DCD6F7] bg-[#3A0CA3] hover:text-[#3A0CA3] hover:bg-purple-200 rounded-full font-medium"
            >
              <Trash2 size={18} /> Delete All
            </button>
          </div>
        </div>

        {/* Notifications Table */}
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
                  onClick={() => toggleRead(n.id)}
                  className={`text-[#7209B7] cursor-pointer border-t border-purple-100 transition-colors ${
                    n.status === "read"
                      ? "bg-gray-50 text-gray-600 hover:bg-purple-50"
                      : "bg-white font-semibold hover:bg-purple-100"
                  }`}
                >
                  <td className="px-6 py-3">
                    {n.status === "read" ? (
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
