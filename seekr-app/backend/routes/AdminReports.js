import express from "express";
import mysql from "mysql2";

const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
});

// ----------------------------
// Reject Lost Report
// ----------------------------
router.put("/lost-reports/:id/reject", (req, res) => {
  const lostId = req.params.id;
  const { adminId, reason, external_lost_id } = req.body;

  if (!adminId || !reason) {
    return res.status(400).json({ error: "Admin ID and reason are required" });
  }

  // UPDATE lost report safely
  const updateSql = `
  UPDATE lost_reports
  SET status = 'reject',
      updated_by_admin = ?,
      reason = ?,
      external_lost_id = COALESCE(?, external_lost_id)
  WHERE lost_id = ?
`;


  db.query(updateSql, [adminId, reason, external_lost_id || null, lostId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // Notify all admins
    const message = `Admin ID #${adminId} rejected Lost ID #${lostId} due to: ${reason}.`;
    const notifSql = `
      INSERT INTO admin_notifications (admin_id, message, status)
      SELECT user_id, ?, 'unread'
      FROM users
      WHERE role = 'admin'
    `;

    db.query(notifSql, [message], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Lost report rejected and notifications sent to all admins." });
    });
  });
});

// ----------------------------
// Mark Lost Report as Found / Returned
// ----------------------------
router.put("/lost-reports/:id/found", (req, res) => {
  const lostId = req.params.id;
  const { adminId, external_lost_id } = req.body;

  if (!adminId) return res.status(400).json({ error: "Admin ID is required" });

  const updateSql = `
  UPDATE lost_reports
  SET status = 'reject',
      updated_by_admin = ?,
      reason = ?,
      external_lost_id = COALESCE(?, external_lost_id)
  WHERE lost_id = ?
`;


  db.query(updateSql, [adminId, external_lost_id || null, lostId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const message = `Admin ID #${adminId} marked Lost ID #${lostId} as returned.`;
    const notifSql = `
      INSERT INTO admin_notifications (admin_id, message, status)
      SELECT user_id, ?, 'unread'
      FROM users
      WHERE role = 'admin'
    `;

    db.query(notifSql, [message], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Lost report marked as found and notifications sent to all admins." });
    });
  });
});

// ----------------------------
// Reject Found Report
// ----------------------------
router.put("/found-reports/:id/reject", (req, res) => {
  const foundId = req.params.id;
  const { adminId, reason, external_founded_id } = req.body;

  if (!adminId || !reason) {
    return res.status(400).json({ error: "Admin ID and reason are required" });
  }

  const updateSql = `
    UPDATE found_reports
    SET status = 'reject',
        updated_by_admin = ?,
        reason = ?,
        external_founded_id = ?
    WHERE found_id = ?
  `;

  db.query(updateSql, [adminId, reason, external_founded_id || null, foundId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const message = `Admin ID #${adminId} rejected Found ID #${foundId} due to: ${reason}.`;
    const notifSql = `
      INSERT INTO admin_notifications (admin_id, message, status)
      SELECT user_id, ?, 'unread'
      FROM users
      WHERE role = 'admin'
    `;

    db.query(notifSql, [message], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Found report rejected and notifications sent to all admins." });
    });
  });
});

// ----------------------------
// Mark Found Report as Returned
// ----------------------------
router.put("/found-reports/:id/found", (req, res) => {
  const foundId = req.params.id;
  const { adminId, external_founded_id } = req.body;

  if (!adminId) return res.status(400).json({ error: "Admin ID is required" });

  const updateSql = `
    UPDATE found_reports
    SET status = 'found',
        updated_by_admin = ?,
        external_founded_id = ?
    WHERE found_id = ?
  `;

  db.query(updateSql, [adminId, external_founded_id || null, foundId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const message = `Admin ID #${adminId} marked Found ID #${foundId} as returned.`;
    const notifSql = `
      INSERT INTO admin_notifications (admin_id, message, status)
      SELECT user_id, ?, 'unread'
      FROM users
      WHERE role = 'admin'
    `;

    db.query(notifSql, [message], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Found report marked as returned and notifications sent to all admins." });
    });
  });
});

export default router;
