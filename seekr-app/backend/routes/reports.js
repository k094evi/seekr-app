import express from "express";
import mysql from "mysql2/promise";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MySQL connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
  waitForConnections: true,
  connectionLimit: 10,
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* =========================================================
   Utility: Get or Create color_id
   ========================================================= */
const getColorId = async (color_name) => {
  if (!color_name) throw new Error("No color name provided");

  const [results] = await db.query(
    "SELECT color_id FROM color WHERE color_name = ?",
    [color_name]
  );

  if (results.length > 0) return results[0].color_id;

  const [insertResult] = await db.query(
    "INSERT INTO color (color_name) VALUES (?)",
    [color_name]
  );
  return insertResult.insertId;
};

/* =========================================================
   Utility: Get location_id by name
   ========================================================= */
const getLocationId = async (location_name) => {
  if (!location_name) throw new Error("No location name provided");

  const [results] = await db.query(
    "SELECT location_id FROM locations WHERE location_name = ?",
    [location_name]
  );

  if (results.length === 0) throw new Error("Invalid location name");
  return results[0].location_id;
};

// Combine user date (YYYY-MM-DD) + current PH (Asia/Manila) time (HH:mm:ss)
const combineWithNowTime = (userDate) => {
  const now = new Date();

  // convert local time -> UTC by adding the timezone offset
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;

  // Manila is UTC+8
  const manilaMs = utcMs + 8 * 60 * 60 * 1000;
  const manila = new Date(manilaMs);

  const hh = String(manila.getHours()).padStart(2, "0");
  const mm = String(manila.getMinutes()).padStart(2, "0");
  const ss = String(manila.getSeconds()).padStart(2, "0");

  return `${userDate} ${hh}:${mm}:${ss}`; // "YYYY-MM-DD HH:MM:SS"
};

/* =========================================================
   🟣 LOST REPORT
   ========================================================= */
router.post("/reports/lost", upload.single("image"), async (req, res) => {
  try {
    const {
      user_id,
      item_lost,
      other_description,
      color_name,
      brand_lost,
      location_name,
      location_description,
      date_lost,   // ⬅ take from frontend
    } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    if (!user_id || !item_lost || !color_name || !location_name || !date_lost) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const color_id = await getColorId(color_name);
    const location_id = await getLocationId(location_name);

    // Combine user date + now time
    const finalDateLost = combineWithNowTime(date_lost);

    // Insert media first
    let media_id = null;
    if (imagePath) {
      const [mediaResult] = await db.query(
        "INSERT INTO item_media (media_path) VALUES (?)",
        [imagePath]
      );
      media_id = mediaResult.insertId;
    }

    const [lostResult] = await db.query(
      `INSERT INTO lost_reports 
      (lost_user, item_lost, other_description, color_id, brand_lost, location_id, location_description, date_lost, status, media_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'missing', ?)`,
      [
        user_id,
        item_lost,
        other_description || null,
        color_id,
        brand_lost || null,
        location_id,
        location_description || null,
        finalDateLost, // ✔ user date + now time
        media_id,
      ]
    );

    const lostId = lostResult.insertId;

    await db.query(
      `INSERT INTO notifications (user_id, message)
       VALUES (?, ?)`,
      [
        user_id,
        `Your lost report has been submitted with Lost ID #${lostId}`,
      ]
    );

    res.json({
      success: true,
      message: "✅ Lost report submitted successfully!",
      lost_id: lostId,
    });
  } catch (err) {
    console.error("❌ Lost report error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* =========================================================
   🟢 FOUND REPORT
   ========================================================= */
router.post("/reports/found", upload.single("image"), async (req, res) => {
  try {
    const {
      user_id,
      item_found,
      description,
      color_name,
      brand_found,
      location_name,
      location_description,
      date_reported,  // ⬅ take from frontend
    } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    if (!user_id || !item_found || !color_name || !location_name || !date_reported) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const color_id = await getColorId(color_name);
    const location_id = await getLocationId(location_name);

    // Combine user date + now time
    const finalDateReported = combineWithNowTime(date_reported);

    let media_id = null;
    if (imagePath) {
      const [mediaResult] = await db.query(
        "INSERT INTO item_media (media_path) VALUES (?)",
        [imagePath]
      );
      media_id = mediaResult.insertId;
    }

    const [foundResult] = await db.query(
      `INSERT INTO found_reports 
       (founded_user, item_found, description, color_id, brand_found, location_id, location_description, date_reported, status, media_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        user_id,
        item_found,
        description || null,
        color_id,
        brand_found || null,
        location_id,
        location_description || null,
        finalDateReported, // ✔ user date + now time
        media_id,
      ]
    );

    const foundId = foundResult.insertId;

    await db.query(
      `INSERT INTO notifications (user_id, message, status, created_at)
       VALUES (?, ?, 'Unread', NOW())`,
      [
        user_id,
        `Your found report with Report ID #${foundId} is now pending for approval.`,
      ]
    );

    res.json({
      success: true,
      message: "✅ Found report submitted successfully!",
      found_id: foundId,
    });
  } catch (err) {
    console.error("❌ Found report error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;