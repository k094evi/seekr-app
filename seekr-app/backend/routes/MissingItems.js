// MissingItems.js
import express from "express";
import mysql from "mysql2";

const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
});

// Combined missing items
router.get("/missing-items", (req, res) => {
  const query = `
    SELECT 
      l.lost_id AS id,
      l.item_lost AS name,
      l.other_description AS description,
      loc.location_name AS location,
      l.date_lost AS dateClaimed,
      'Lost' AS status
    FROM lost_reports l
    LEFT JOIN locations loc ON l.location_id = loc.location_id
    WHERE l.status = 'missing'
    UNION ALL
    SELECT 
      f.report_id AS id,
      f.item_found AS name,
      f.description AS description,
      loc.location_name AS location,
      f.date_reported AS dateClaimed,
      'Found' AS status
    FROM found_reports f
    LEFT JOIN locations loc ON f.location_id = loc.location_id
    WHERE f.status = 'Missing'
    ORDER BY dateClaimed DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Only found items
router.get("/found-items", (req, res) => {
  const query = `
    SELECT f.report_id AS id, f.item_found AS name, f.description,
           loc.location_name AS location, f.date_reported AS dateClaimed,
           'Found' AS status
    FROM found_reports f
    LEFT JOIN locations loc ON f.location_id = loc.location_id
    WHERE f.status = 'Missing'
    ORDER BY f.date_reported DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Only lost items
router.get("/lost-items", (req, res) => {
  const query = `
    SELECT l.lost_id AS id, l.item_lost AS name, l.other_description AS description,
           loc.location_name AS location, l.date_lost AS dateClaimed,
           'Lost' AS status
    FROM lost_reports l
    LEFT JOIN locations loc ON l.location_id = loc.location_id
    WHERE l.status = 'missing'
    ORDER BY l.date_lost DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

export default router;
