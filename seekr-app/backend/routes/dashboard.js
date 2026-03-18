import express from "express";
import mysql from "mysql2";

const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
});

//Status: Pending, Approved Missings, Returned, Rejected
router.get("/counts", (req, res) => {
  const query = `
    SELECT status, COUNT(*) AS count
    FROM found_reports
    GROUP BY status
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching dashboard counts:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const counts = { Pending: 0, Missing: 0, Returned: 0, Rejected: 0 };

    results.forEach((row) => {
      if (counts.hasOwnProperty(row.status)) {
        counts[row.status] = row.count;
      }
    });

    res.json({
      pending: counts.Pending,
      missing: counts.Missing,
      returned: counts.Returned,
      rejected: counts.Rejected,
    });
  });
});

// Locations with Most Missing Items - Top 5
router.get("/locations", (req, res) => {
  const query = `
    SELECT 
      l.location_name AS name,
      COUNT(f.report_id) AS value
    FROM locations l
    LEFT JOIN found_reports f ON f.location_id = l.location_id
    GROUP BY l.location_id, l.location_name
    ORDER BY value DESC
    LIMIT 5;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching top 5 locations:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Sort ascending so left = 5th, right = top 1
    results.sort((a, b) => a.value - b.value);

    res.json(results);
  });
});

// Number of reported lost or found items for the current day (filtered by status)
router.get("/reports-today", (req, res) => {
  const query = `
    SELECT 'missing' AS type, COUNT(*) AS count
    FROM lost_reports
    WHERE DATE(date_lost) = CURDATE()
      AND status = 'missing'
    UNION ALL
    SELECT 'pending' AS type, COUNT(*) AS count
    FROM found_reports
    WHERE DATE(date_reported) = CURDATE()
      AND status = 'Pending';
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching today's reports:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Expected output:
    // [{ type: "Lost", count: 3 }, { type: "Found", count: 5 }]
    res.json(results);
  });
});

// Backend route: returns number of people that returned/surrendered items grouped by role
router.get("/returns-by-role", (req, res) => {
  const query = `
    SELECT 
      u.role AS role,
      COUNT(DISTINCT f.founded_user) AS value
    FROM found_reports f
    JOIN users u ON f.founded_user = u.user_id
    -- Make sure the statuses match exactly what's in your DB
    WHERE f.status IN ('Returned', 'Claimed', 'Missing') 
    GROUP BY u.role;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching returned/surrendered items by role:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Ensure the results always return an array
    res.json(results || []);
  });
});



// Recent Reports - Top 5 (Lost + Found)
router.get("/recent-reports", (req, res) => {
  const query = `
    SELECT 'Lost' AS status, l.lost_id AS id, l.item_lost AS item, loc.location_name AS location, l.date_lost AS created_at
    FROM lost_reports l
    LEFT JOIN locations loc ON l.location_id = loc.location_id

    UNION ALL

    SELECT 'Found' AS status, f.report_id AS id, f.item_found AS item, loc.location_name AS location, f.date_reported AS created_at
    FROM found_reports f
    LEFT JOIN locations loc ON f.location_id = loc.location_id

    ORDER BY created_at DESC, id DESC
    LIMIT 5
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching recent reports:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

export default router;
