import express from "express";
import mysql from "mysql2";

const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
});

// GET all global notifications
router.get("/", (req, res) => {
  const query = `
    SELECT 
      notification_id AS id,
      message,
      status,
      DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
      DATE_FORMAT(created_at, '%h:%i %p') AS time
    FROM admin_notifications
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// Mark one notification as read/unread
router.put("/toggle-read/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE admin_notifications 
    SET status = IF(status = 'unread', 'read', 'unread')
    WHERE notification_id = ?
  `;

  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Notification updated" });
  });
});

// Mark all as read
router.put("/mark-all/:admin_id", (req, res) => {
  const query = `
    UPDATE admin_notifications 
    SET status = 'read'
  `;

  db.query(query, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "All notifications marked as read" });
  });
});


// Delete all notifications
router.delete("/delete-all/:admin_id", (req, res) => {
  const query = `
    DELETE FROM admin_notifications
  `;

  db.query(query, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "All notifications deleted" });
  });
});


export default router;
