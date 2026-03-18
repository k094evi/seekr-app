// src/pages/MissingItems.jsx
import React, { useState, useEffect, useRef } from "react";
import { SortAsc, Filter, Search } from "lucide-react";

const locations = [
  "Atrium",
  "Lobby",
  "Library",
  "Cafeteria",
  "Gymnasium",
  "Parking Area",
  "Computer Lab",
  "Nursing Lab",
  "Accounting Office",
  "Registrar’s Office",
  "Guidance Office",
  "Student Center",
  "Admin Office",
  "Clinic",
  "Faculty Room",
  "AVR (Audio Visual Room)",
  "Stairs",
  "Comfort Room",
  "Multi Purpose Hall A",
  "Multi Purpose Hall B",
  "Multi Purpose Hall C",
  "Lecture Hall A",
  "Lecture Hall B",
  "Lecture Hall C",
  "Others",
];

export default function MissingItems() {
  const [items, setItems] = useState([]); // ✅ from backend
  const [sortPopup, setSortPopup] = useState(false);
  const [filterPopup, setFilterPopup] = useState(false);
  const [sortType, setSortType] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortRef = useRef(null);
  const filterRef = useRef(null);

  // ✅ Fetch items from backend (Node + MySQL via XAMPP)
  useEffect(() => {
    fetch("http://localhost:5000/api/missing-items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // ✅ Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortRef.current &&
        !sortRef.current.contains(event.target) &&
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setSortPopup(false);
        setFilterPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Sort logic
  const sortedItems = [...items].sort((a, b) => {
    if (sortType === "Item Name (A-Z)") return a.name.localeCompare(b.name);
    if (sortType === "Location (A-Z)") return a.location.localeCompare(b.location);
    if (sortType === "Date (Newest to Oldest)")
      return new Date(b.dateClaimed) - new Date(a.dateClaimed);
    if (sortType === "Date (Oldest to Newest)")
      return new Date(a.dateClaimed) - new Date(b.dateClaimed);
    return 0;
  });

  // ✅ Filter logic
  const filteredItems = sortedItems.filter((item) => {
    const matchesLocation =
      selectedLocations.length === 0 || selectedLocations.includes(item.location);
    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(item.status);
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocation && matchesStatus && matchesSearch;
  });

  // ✅ Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleLocationToggle = (loc) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((item) => item !== loc) : [...prev, loc]
    );
  };

  const handleStatusToggle = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  return (
    <div className="flex justify-center w-full bg-gray-50 text-gray-800 min-h-screen">
      <main className="flex-1 max-w-6xl p-8 w-full">
        <h2 className="text-4xl font-semibold text-[#3A0CA3] mb-6 text-center md:text-left">
          Missing Items
        </h2>

        <div className="text-l items-center justify-center mb-6 p-4 bg-purple-50 border-l-4 border-purple-400 text-purple-700 rounded-lg">
          <p>Notice:</p>
          <ul className="list-disc ml-6 text-sm">
            <li>
              Lost or misplaced items should be surrendered and claimed at the Student Discipline Department (SDD) office.
            </li>
            <li>
              Unclaimed items after <strong>seven (7) school days</strong> may be donated to the adopted community through the Community Extension Office (CEO) or disposed of, subject to SDD’s evaluation.
            </li>
            <li>A <strong>“Lost”</strong> tag indicates that a user has reported an item they own that is missing.</li>
            <li>A <strong>“Found”</strong> tag indicates that a user has discovered an item that may belong to someone else.</li>
          </ul>
        </div>

        {/* Sort, Filter, Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          {/* Search */}
          <div className="flex items-center border border-purple-200 rounded-full px-3 py-2 bg-white w-full md:w-1/2 [box-shadow:inset_2.88px_2.88px_11.5px_0px_rgba(0,0,0,0.100),5.75px_5.75px_11.5px_0px_rgba(255,255,255,0.75)]">
            <Search size={18} className="text-purple-600 mr-2" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none text-sm"
            />
          </div>

          {/* Sort + Filter */}
          <div className="flex items-center justify-end gap-2 mt-3 md:mt-0 w-full md:w-auto">
            {/* Sort */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => {
                  setSortPopup(!sortPopup);
                  setFilterPopup(false);
                }}
                className="p-2 rounded-md hover:bg-purple-100 text-purple-700"
              >
                <SortAsc size={20} />
              </button>
              {sortPopup && (
                <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-56 p-3 z-50">
                  <h3 className="text-sm font-semibold mb-2 text-purple-700">Sort By</h3>
                  {[
                    "Item Name (A-Z)",
                    "Location (A-Z)",
                    "Date (Newest to Oldest)",
                    "Date (Oldest to Newest)",
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortType(option);
                        setSortPopup(false);
                      }}
                      className="block w-full text-left p-2 rounded hover:bg-purple-100 text-gray-700 text-sm"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => {
                  setFilterPopup(!filterPopup);
                  setSortPopup(false);
                }}
                className="p-2 rounded-md hover:bg-purple-100 text-purple-700"
              >
                <Filter size={20} />
              </button>
              {filterPopup && (
                <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-[300px] p-4 max-h-[400px] overflow-y-auto z-50">
                  <h3 className="text-sm font-semibold mb-3 text-purple-700">Filter</h3>

                  {/* Status Filter */}
                  <div className="mb-3">
                    <h4 className="font-medium mb-1 text-[#3A0CA3] text-sm">Status</h4>
                    <div className="flex flex-col gap-2">
                      {["Lost", "Found"].map((status) => (
                        <label
                          key={status}
                          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-purple-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStatus.includes(status)}
                            onChange={() => handleStatusToggle(status)}
                            className="accent-purple-600"
                          />
                          <span>{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <h4 className="font-medium mb-1 text-[#3A0CA3] text-sm">Location</h4>
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto text-sm">
                      {locations.map((loc) => (
                        <label
                          key={loc}
                          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-purple-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedLocations.includes(loc)}
                            onChange={() => handleLocationToggle(loc)}
                            className="accent-purple-600"
                          />
                          <span>{loc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-4xl shadow-md border border-purple-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#3A0CA3] text-[#DCD6F7] uppercase text-l">
              <tr>
                <th className="px-6 py-3">Item Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Date Reported</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  className="text-[#7209B7] border-t border-purple-100 hover:bg-purple-200 transition-colors"
                >
                  <td className="px-6 py-3 font-medium">{item.name}</td>
                  <td className="px-6 py-3">{item.description}</td>
                  <td className="px-6 py-3">{item.location}</td>
                  <td className="px-6 py-3">
                    {new Date(item.dateClaimed).toLocaleDateString()}
                  </td>
                  <td
                    className={`px-6 py-3 font-semibold ${
                      item.status === "Lost" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {item.status}
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </main>
    </div>
  );
}
