import express from "express";
import mysql from "mysql2";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Route imports
import reportRoutes from "./routes/reports.js";
import dashboardRoutes from "./routes/dashboard.js";
import userHistoryRoutes from "./routes/UserHistory.js";
import missingItemsRoutes from "./routes/MissingItems.js";
import adminFoundReportsRoutes from "./routes/AdminFoundReports.js"; 
import adminLostReportsRoutes from "./routes/AdminLostReports.js";
import adminUploadRoutes from "./routes/adminUpload.js";
import userRoutes from "./routes/users.js";
import UserNotificationRoutes from "./routes/UserNotifications.js";
import AdminNotifications from "./routes/AdminNotifications.js";
import AdminReportsRoutes from "./routes/AdminReports.js";

// ✅ Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ CRITICAL: Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
});

db.connect((err) => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to MySQL database 'seekrapp'");
});

// ✅ Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email_user = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    const user = results[0];

    // ✅ Verify password (should use bcrypt in production)
    if (password !== user.password_user) {
      return res.status(401).json({ success: false, error: "Incorrect password" });
    }

    console.log(`✅ ${user.role} '${user.email_user}' (ID: ${user.user_id}) logged in successfully.`);

    // ✅ Send response with all user info
    res.json({
      success: true,
      message: "Login successful",
      user_id: user.user_id,
      email: user.email_user,
      role: user.role,
      Fname: user.fname_user,
      Lname: user.lname_user,
      contact: user.contact_user,
      program: user.program,
    });
  });
});

// ✅ Routes
app.use("/api", reportRoutes);
app.use("/api", userHistoryRoutes);
app.use("/api", missingItemsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", adminFoundReportsRoutes);
app.use("/api", adminLostReportsRoutes); 
app.use("/api/admin-upload", adminUploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", UserNotificationRoutes);
app.use("/admin/notifications", AdminNotifications);
app.use("/api/admin-reports", AdminReportsRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 SeekrApp backend is running!");
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ✅ Start backend server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("💡 Welcome! The Seekr backend is ready for requests.");
  console.log(`📁 Serving uploads from: ${path.join(__dirname, "uploads")}`);
});