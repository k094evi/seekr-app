import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function AdmDashboard() {
  const [currentUser, setCurrentUser] = useState({ Fname: "", Lname: "" });
  const [stats, setStats] = useState({
    pending: 0,
    missing: 0,
    returned: 0,
    rejected: 0,
  });

  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [mostMissing, setMostMissing] = useState([]);
  const [recentReports, setRecentReports] = useState([]);

  const COLORS = ["#4361EE", "#7209B7", "#E6DEFF", "#3A0CA3"];

  // ADDED: Responsive screen hooks
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
      setIsTablet(window.innerWidth > 640 && window.innerWidth <= 820);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser({
      Fname: user.Fname || "Admin",
      Lname: user.Lname || "User"
    });
  }, []);

  // Fetch dashboard counts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/counts")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading dashboard stats:", err));
  }, []);

  // Fetch locations for bar chart
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/locations")
      .then((res) => {
        const sorted = res.data.sort((a, b) => b.value - a.value);
        setBarData(sorted);
      })
      .catch((err) => console.error("Error loading location stats:", err));
  }, []);

  // Fetch today's lost and found reports for pie chart
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/reports-today")
      .then((res) => {
        const data = res.data;
        const total = data.reduce((sum, item) => sum + item.count, 0);

        const labelMap = {
          missing: "Missing (Lost Reports)",
          pending: "Pending (Found Reports)",
        };

        const formatted = data.map((item) => ({
          name: labelMap[item.type] || item.type,
          value: item.count,
          percentage: total === 0 ? 0 : Math.round((item.count / total) * 100),
        }));

        setPieData(formatted);
      })
      .catch((err) =>
        console.error("Error loading today's reports for pie chart:", err)
      );
  }, []);

  // Fetch number of persons that returned items
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/returns-by-role")
      .then((res) => {
        const data = res.data;
        const total = data.reduce((sum, role) => sum + role.value, 0);
        const formatted = data.map((role) => ({
          name: role.role.charAt(0).toUpperCase() + role.role.slice(1),
          value: role.value,
          percentage: total === 0 ? 0 : Math.round((role.value / total) * 100),
        }));

        setMostMissing(formatted);
      })
      .catch((err) =>
        console.error("Error loading returned/surrendered items by role:", err)
      );
  }, []);

  // Fetch recent reports
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard/recent-reports")
      .then((res) => setRecentReports(res.data))
      .catch((err) => console.error("Error loading recent reports:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#3A0CA3] font-poppins p-4 sm:p-6">

      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#3A0CA3]">
          Welcome, {currentUser.Fname} {currentUser.Lname}!
        </h1>
      </div>

      {/* Stats Section */}
      <section>
        <h2 className="text-2xl font-semibold text-[#3A0CA3] mb-4">
          General Statistical Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Pending", value: stats.pending },
            { label: "Approved Missings", value: stats.missing },
            { label: "Claimed", value: stats.returned },
            { label: "Rejected", value: stats.rejected },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-3xl p-4 text-center border border-[#3A0CA3]/20"
            >
              <h3 className="text-4xl font-bold bg-gradient-to-r from-[#3A0CA3] to-[#3A0CA3] text-transparent bg-clip-text">
                {stat.value}
              </h3>
              <p className="text-[#4361EE]/70 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Bar Chart */}
        <div className="bg-white rounded-3xl p-4 shadow-md border border-[#3A0CA3]/20">
          <h3 className="font-semibold mb-3 text-xl text-[#3A0CA3] mt-2">
            Locations with the Most Missing Items
          </h3>
          <div className="w-full h-[16rem] sm:h-[20rem]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 5, right: 10, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
                <XAxis dataKey="name" tick={{ fill: "#7209B7", fontSize: 16 }} />
                <YAxis tick={{ fill: "#7209B7", fontSize: 16 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f5f3ff",
                    border: "1px solid #d8b4fe",
                    borderRadius: "10px",
                    fontSize: "13px",
                  }}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3A0CA3" />
                    <stop offset="50%" stopColor="#7209B7" />
                    <stop offset="100%" stopColor="#4361EE" />
                  </linearGradient>
                </defs>
                <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-[#3A0CA3]/20 flex flex-col">
          <h3 className="font-semibold mb-3 text-xl text-[#3A0CA3]">
            Number of Reported Lost and Found Items Today
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">

            {/* ADJUSTED DYNAMIC HEIGHT */}
            <div className={`${isMobile ? "h-[14rem]" : isTablet ? "h-[18rem]" : "h-[20rem]"} w-full sm:w-[45%]`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : isTablet ? 55 : 60}
                    outerRadius={isMobile ? 70 : isTablet ? 90 : 110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f5f3ff",
                      border: "1px solid #d8b4fe",
                      borderRadius: "10px",
                      fontSize: "13px",
                      color: "#7209B7",
                    }}
                    itemStyle={{
                      color: "#7209B7",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                    labelStyle={{
                      color: "#3A0CA3",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col justify-center text-sm text-[#3A0CA3] space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium text-lg">{item.name}</span>
                  <span className="text-[#3A0CA3]/70 font-semibold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Most Missing Items */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-[#3A0CA3] mb-3">
            Percentage of People that Return Items
          </h2>
          <div className="flex flex-col gap-4">
            {mostMissing.length > 0 ? (
              mostMissing.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] px-5 py-3 flex flex-col gap-1 border border-[#3A0CA3]/20"
                >
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-lg text-[#7209B7] font-medium">{item.name}</span>
                    <span className="text-[#3A0CA3]/70">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#ede9fe] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        background:
                          "linear-gradient(90deg, #4361EE, #7209B7, #3A0CA3, #4CC9F0)",
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#7209B7] text-center">No return or surrender data available.</p>
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-[#3A0CA3] mb-3">
            Recent Reports
          </h2>
          <div className="hidden sm:grid grid-cols-4 text-[#3A0CA3] font-semibold text-lg px-4 mb-2">
            <span>Report ID</span>
            <span>Lost/Found</span>
            <span>Item Name</span>
            <span>Location</span>
          </div>
          <div className="flex flex-col gap-3">
            {recentReports.length > 0 ? (
              recentReports.map((report) => (
                <div
                  key={report.status + report.id}
                  className="bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] px-5 py-3 border border-[#3A0CA3]/20 hover:bg-[#7209B7]/5 transition"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-4 text-l items-center gap-3">
                    <span className="font-semibold text-[#7209B7]">{report.id}</span>
                    <span
                      className={`font-semibold ${
                        report.status === "Found" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {report.status}
                    </span>
                    <span className="font-medium text-[#7209B7]">{report.item}</span>
                    <span className="font-medium text-[#7209B7]">{report.location}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#7209B7] text-center">No recent reports found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
