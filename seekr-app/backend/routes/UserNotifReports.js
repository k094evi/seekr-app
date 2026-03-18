import express from "express";
import mysql from "mysql2";
import multer from "multer";
import path from "path";
import { createNotification } from "./notifications.js";

const router = express.Router();

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
});

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ POST: Submit a LOST report
router.post("/reports/lost", upload.single("image"), (req, res) => {
  const {
    user_id,
    item_lost,
    other_description,
    color_name,
    brand_lost,
    location_name,
    date_lost,
  } = req.body;

  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO lost_reports 
    (user_id, item_lost, other_description, color_name, brand_lost, location_name, date_lost, image_path, report_status, date_reported) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'missing', NOW())
  `;

  db.query(
    sql,
    [user_id, item_lost, other_description, color_name, brand_lost, location_name, date_lost, image_path],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting lost report:", err);
        return res.status(500).json({ error: "Failed to submit lost report" });
      }

      const lostId = result.insertId;
      console.log(`✅ Lost report submitted successfully with ID: ${lostId}`);

      // 🔔 Create notification for the user
      const notificationMessage = `Your lost report has been submitted and tagged with Lost ID #${lostId}`;
      createNotification(user_id, notificationMessage, (notifErr) => {
        if (notifErr) {
          console.error("⚠️ Failed to create notification, but report was submitted");
        }
      });

      res.json({
        success: true,
        message: "Lost report submitted successfully!",
        lost_id: lostId,
      });
    }
  );
});

// ✅ PATCH: Update lost report status to "rejected"
router.patch("/reports/lost/:lostId/reject", (req, res) => {
  const { lostId } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ error: "Rejection reason is required" });
  }

  // First, get the user_id for this report
  const getUserSql = "SELECT user_id FROM lost_reports WHERE lost_id = ?";
  
  db.query(getUserSql, [lostId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching user_id:", err);
      return res.status(500).json({ error: "Failed to fetch report details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Report not found" });
    }

    const userId = results[0].user_id;

    // Update the report status to rejected
    const updateSql = `
      UPDATE lost_reports 
      SET report_status = 'rejected', reason = ? 
      WHERE lost_id = ?
    `;

    db.query(updateSql, [reason, lostId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error("❌ Error rejecting report:", updateErr);
        return res.status(500).json({ error: "Failed to reject report" });
      }

      console.log(`✅ Lost report #${lostId} rejected`);

      // 🔔 Create notification for the user
      const notificationMessage = `Your lost report with the tagged Lost ID #${lostId} has been rejected due to: ${reason}`;
      createNotification(userId, notificationMessage, (notifErr) => {
        if (notifErr) {
          console.error("⚠️ Failed to create notification, but report was rejected");
        }
      });

      res.json({
        success: true,
        message: "Report rejected successfully",
      });
    });
  });
});

// ✅ PATCH: Update lost report status to "claimed"
router.patch("/reports/lost/:lostId/claim", (req, res) => {
  const { lostId } = req.params;

  // First, get the user_id for this report
  const getUserSql = "SELECT user_id FROM lost_reports WHERE lost_id = ?";
  
  db.query(getUserSql, [lostId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching user_id:", err);
      return res.status(500).json({ error: "Failed to fetch report details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Report not found" });
    }

    const userId = results[0].user_id;

    // Update the report status to claimed
    const updateSql = `
      UPDATE lost_reports 
      SET report_status = 'claimed' 
      WHERE lost_id = ?
    `;

    db.query(updateSql, [lostId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error("❌ Error claiming report:", updateErr);
        return res.status(500).json({ error: "Failed to claim report" });
      }

      console.log(`✅ Lost report #${lostId} marked as claimed`);

      // 🔔 Create notification for the user
      const notificationMessage = `Your lost report with the tagged Lost ID #${lostId} has been successfully claimed.`;
      createNotification(userId, notificationMessage, (notifErr) => {
        if (notifErr) {
          console.error("⚠️ Failed to create notification, but report was claimed");
        }
      });

      res.json({
        success: true,
        message: "Report marked as claimed successfully",
      });
    });
  });
});

// ✅ POST: Submit a FOUND report
router.post("/reports/found", upload.single("image"), (req, res) => {
  const {
    user_id,
    item_found,
    description,
    color_name,
    brand_found,
    location_name,
    location_description,
    date_reported,
  } = req.body;

  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO found_reports 
    (user_id, item_found, description, color_name, brand_found, location_name, location_description, date_reported, image_path, report_status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `;

  db.query(
    sql,
    [user_id, item_found, description, color_name, brand_found, location_name, location_description, date_reported, image_path],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting found report:", err);
        return res.status(500).json({ error: "Failed to submit found report" });
      }

      const foundId = result.insertId;
      console.log(`✅ Found report submitted successfully with ID: ${foundId}`);

      // 🔔 Create notification for the user
      const notificationMessage = `Your found report has been submitted and tagged with Found ID #${foundId}`;
      createNotification(user_id, notificationMessage, (notifErr) => {
        if (notifErr) {
          console.error("⚠️ Failed to create notification, but report was submitted");
        }
      });

      res.json({
        success: true,
        message: "Found report submitted successfully!",
        found_id: foundId,
      });
    }
  );
});

export default router;