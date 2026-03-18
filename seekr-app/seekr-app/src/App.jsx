import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ USER PAGES
import User_Sidebar from "./pages/User_Sidebar";
import User_MissingItems from "./pages/User_MissingItems";
import User_History from "./pages/User_History";
import User_Notifications from "./pages/User_Notifications";
import User_UploadReport from "./pages/User_UploadReport";

// ✅ ADMIN PAGES
import Admin_Sidebar from "./pages/Admin_Sidebar";
import Admin_Dashboard from "./pages/Admin_Dashboard";
import FoundReports from "./pages/Admin_FoundReports";
import LostReports from "./pages/Admin_LostReports";
import Admin_Notifications from "./pages/Admin_Notifications";
import Admin_UploadReport from "./pages/Admin_UploadReports";
import Admin_Settings from "./pages/Admin_Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ==============================
            🧍 USER ROUTES
        =============================== */}
        <Route
          path="/user_sidebar"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <User_Sidebar />
            </ProtectedRoute>
          }
        >
          <Route index element={<User_MissingItems />} />
          <Route path="missing" element={<User_MissingItems />} />
          <Route path="history" element={<User_History />} />
          <Route path="notifications" element={<User_Notifications />} />
          <Route path="upload" element={<User_UploadReport />} />
        </Route>

        {/* ==============================
            🧑‍💼 ADMIN ROUTES
        =============================== */}
        <Route
          path="/admin_sidebar"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin_Sidebar />
            </ProtectedRoute>
          }
        >
          {/* 👇 Fix for "No routes matched location '/admin_sidebar'" */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Admin_Dashboard />} />
          <Route path="found" element={<FoundReports />} />
          <Route path="lost" element={<LostReports />} />
          <Route path="notifications" element={<Admin_Notifications />} />
          <Route path="upload" element={<Admin_UploadReport />} />
          <Route path="settings" element={<Admin_Settings />} /> 
        </Route>

        {/* ✅ Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}