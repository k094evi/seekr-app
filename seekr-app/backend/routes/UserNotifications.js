import express from "express";
import mysql from "mysql2";

const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
});


/*
 *  GET notifications by user_id
 *  URL → /api/notifications/:userId
 */
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const q = `
    SELECT notification_id, message, status, created_at
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(q, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

/*
 *  PATCH - Mark notification as read
 *  URL → /api/notifications/:id/read
 */
router.patch("/:id/read", async (req, res) => {
  const { id } = req.params;

  try {
    const q = `
      UPDATE notifications
      SET status = 'Read'
      WHERE notification_id = ?
    `;
    await db.query(q, [id]);
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking as read:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/*
 *  PATCH - Mark notification as unread
 *  URL → /api/notifications/:id/unread
 */
router.patch("/:id/unread", async (req, res) => {
  const { id } = req.params;

  try {
    const q = `
      UPDATE notifications
      SET status = 'Unread'
      WHERE notification_id = ?
    `;
    await db.query(q, [id]);
    res.json({ message: "Notification marked as unread" });
  } catch (err) {
    console.error("Error marking as unread:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/*
 * DELETE all notifications of a user
 * URL → /api/notifications/user/:userId
 */
router.delete("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const q = `
    DELETE FROM notifications
    WHERE user_id = ?
  `;

  db.query(q, [userId], (err) => {
    if (err) {
      console.error("Error deleting notifications:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "All notifications deleted" });
  });
});

export default router;
