// routes/adminUpload.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import mysql from "mysql2";

const router = express.Router();

// ================================
// MYSQL POOL
// ================================
export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ================================
// MULTER STORAGE
// ================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  },
});

const upload = multer({ storage });

// ================================
// HELPER: Get Philippine Time
// ================================
function getPhilippineTime() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
}

// ================================
// HELPER: Combine date with current PH time
// ================================
function combineDateWithCurrentTime(dateString) {
  if (!dateString) return getPhilippineTime();
  
  // Get current Philippine time
  const phTime = getPhilippineTime();
  
  // Parse the date from frontend (YYYY-MM-DD)
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Create new date with user's selected date + current PH time
  const combined = new Date(
    year,
    month - 1, // month is 0-indexed
    day,
    phTime.getHours(),
    phTime.getMinutes(),
    phTime.getSeconds()
  );
  
  return combined;
}

// ================================
// POST /api/admin-upload/external/submit
// ================================
router.post("/external/submit", upload.single("image"), (req, res) => {
  const body = req.body;
  const file = req.file;

  // Validate required fields
  if (!body.itemName || !body.lostFound || !body.firstName || !body.lastName || !body.email) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Check internal user first
  db.query(
    "SELECT user_id FROM users WHERE LOWER(email_user) = LOWER(?)",
    [body.email],
    (err, internalRows) => {
      if (err) return res.status(500).json({ error: "Internal user lookup error." });

      if (internalRows.length > 0) {
        return proceed(internalRows[0].user_id, null);
      }

      // Check external users
      db.query(
        "SELECT external_id FROM external_users WHERE LOWER(email_ext) = LOWER(?)",
        [body.email],
        (err, externalRows) => {
          if (err) return res.status(500).json({ error: "External lookup error." });

          if (externalRows.length > 0) {
            return res.status(400).json({
              error: "This email already exists as an external user.",
            });
          }

          proceed(null, "CREATE_EXTERNAL");
        }
      );
    }
  );

  // ===========================================
  // PROCEED FUNCTION
  // ===========================================
  function proceed(internalId, externalMode) {
    db.getConnection((err, conn) => {
      if (err) return res.status(500).json({ error: "Database connection error." });

      const fail = (msg, err) => {
        console.error(msg, err);
        conn.rollback(() => {
          conn.release();
          res.status(500).json({ error: msg });
        });
      };

      conn.beginTransaction(err => {
        if (err) return fail("Transaction error", err);

        let externalId = null;
        const now = getPhilippineTime(); // 👈 Current PH time for record creation
        const reportDateTime = combineDateWithCurrentTime(body.dateReported); // 👈 User's date + current PH time

        // Create external user if needed
        const insertExternal = (next) => {
          if (!externalMode) return next();

          const sql = `
            INSERT INTO external_users 
            (fname_ext, mname_ext, lname_ext, email_ext, occupation_ext, date_created)
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          conn.query(
            sql,
            [
              body.firstName,
              body.middleName || null,
              body.lastName,
              body.email,
              body.occupation || null,
              now,
            ],
            (err, result) => {
              if (err) return fail("Failed to save external user.", err);
              externalId = result.insertId;
              next();
            }
          );
        };

        // Lookup helper functions
        const getColorId = (next) => {
          if (!body.color) return next(null, null);
          conn.query("SELECT color_id FROM color WHERE color_name = ?", [body.color], (err, rows) => {
            if (err) return next(err);
            next(null, rows[0]?.color_id || null);
          });
        };

        const getLocationId = (next) => {
          if (!body.location) return next(null, null);
          conn.query("SELECT location_id FROM locations WHERE location_name = ?", [body.location], (err, rows) => {
            if (err) return next(err);
            next(null, rows[0]?.location_id || null);
          });
        };

        // Insert media file
        const insertMedia = (next) => {
          if (!file) return next(null, null);
          conn.query(
            "INSERT INTO item_media (media_path, uploaded_at) VALUES (?, ?)",
            [file.filename, now],
            (err, result) => {
              if (err) return fail("Failed to save media.", err);
              next(null, result.insertId);
            }
          );
        };

        // Start execution
        insertExternal(() => {
          getColorId((err, colorId) => {
            if (err) return fail("Color lookup failed.", err);

            getLocationId((err, locationId) => {
              if (err) return fail("Location lookup failed.", err);

              insertMedia((err, mediaId) => {
                if (err) return;

                const internalOrExternal = internalId
                  ? [internalId, null]
                  : [null, externalId];

                // ============= FOUND REPORT =============
                if (body.lostFound === "Found") {
                  const sql = `
                    INSERT INTO found_reports (
                      founded_user, external_founded_id, item_found, description, color_id,
                      brand_found, date_reported, location_id, location_description, status,
                      reviewed_by, media_id
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NULL, ?)
                  `;

                  conn.query(
                    sql,
                    [
                      internalOrExternal[0],
                      internalOrExternal[1],
                      body.itemName,
                      body.description || null,
                      colorId,
                      body.brand || null,
                      reportDateTime,  // 👈 User's selected date + current PH time
                      locationId,
                      body.locationDescription || null,
                      mediaId,
                    ],
                    (err, result) => {
                      if (err) return fail("Failed to save found report.", err);

                      conn.commit(() => {
                        conn.release();
                        res.json({ success: true, reportType: "Found", report_id: result.insertId });
                      });
                    }
                  );

                // ============= LOST REPORT =============
                } else {
                  const sql = `
                    INSERT INTO lost_reports (
                      lost_user, external_lost_id, item_lost, other_description, color_id,
                      brand_lost, location_id, location_description, date_lost, status, media_id
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'missing', ?)
                  `;

                  conn.query(
                    sql,
                    [
                      internalOrExternal[0],
                      internalOrExternal[1],
                      body.itemName,
                      body.description || null,
                      colorId,
                      body.brand || null,
                      locationId,
                      body.locationDescription || null,
                      reportDateTime, // 👈 User's selected date + current PH time
                      mediaId,
                    ],
                    (err, result) => {
                      if (err) return fail("Failed to save lost report.", err);

                      conn.commit(() => {
                        conn.release();
                        res.json({ success: true, reportType: "Lost", report_id: result.insertId });
                      });
                    }
                  );
                }
              });
            });
          });
        });
      });
    });
  }
});

export default router;