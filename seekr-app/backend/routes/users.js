import express from "express";
import mysql from "mysql2";

const router = express.Router();

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
});

// UPDATE NAME
router.put("/update-info/:id", (req, res) => {
  const userId = req.params.id;
  const { fname_user, mname_user, lname_user } = req.body;

  const sql = `
    UPDATE users 
    SET fname_user = ?, mname_user = ?, lname_user = ?
    WHERE user_id = ?
  `;

  db.query(sql, [fname_user, mname_user, lname_user, userId], (err, result) => {
    if (err) {
      console.error("❌ Error updating user info:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.json({
      success: true,
      message: "User info updated successfully",
    });
  });
});

// UPDATE PASSWORD
router.put("/update-password/:id", (req, res) => {
  const userId = req.params.id;
  const { email_user, currentPassword, newPassword } = req.body;

  const sqlCheck = `SELECT * FROM users WHERE user_id = ? AND email_user = ?`;

  db.query(sqlCheck, [userId, email_user], (err, results) => {
    if (err) {
      console.error("❌ Error checking password:", err);
      return res.status(500).json({ success: false });
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const user = results[0];

    if (user.password_user !== currentPassword) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    const sqlUpdate = `UPDATE users SET password_user = ? WHERE user_id = ?`;

    db.query(sqlUpdate, [newPassword, userId], (err2) => {
      if (err2) {
        console.error("❌ Error updating password:", err2);
        return res.status(500).json({ success: false });
      }

      res.json({ success: true, message: "Password updated successfully" });
    });
  });
});

export default router;