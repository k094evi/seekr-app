import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
});

// ====================================================
// UPDATE USER NAME
// ====================================================
export const updateUserInfo = async (req, res) => {
  const { id } = req.params;
  const { fname_user, mname_user, lname_user } = req.body;

  const sql = `
    UPDATE users 
    SET fname_user = ?, mname_user = ?, lname_user = ?
    WHERE user_id = ?
  `;

  try {
    await db.query(sql, [fname_user, mname_user, lname_user, id]);
    res.json({ success: true, message: "Name updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err });
  }
};

// ====================================================
// UPDATE EMAIL + PASSWORD
// ====================================================
export const updateEmailAndPassword = async (req, res) => {
  const { id } = req.params;
  const { email_user, currentPassword, newPassword } = req.body;

  // 1. Check existing password
  const [rows] = await db.query(
    "SELECT password_user FROM users WHERE user_id = ?",
    [id]
  );

  if (rows.length === 0)
    return res.status(404).json({ error: "User not found" });

  if (rows[0].password_user !== currentPassword)
    return res.status(400).json({ error: "Current password incorrect" });

  // 2. Update
  const sql = `
    UPDATE users 
    SET email_user = ?, password_user = ?
    WHERE user_id = ?
  `;

  try {
    await db.query(sql, [email_user, newPassword, id]);
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err });
  }
};
