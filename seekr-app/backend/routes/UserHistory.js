// UserHistory.js
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

// API to get all returned items from both found_reports and lost_reports
router.get("/returned-items", (req, res) => {
  const query = `
    SELECT 
      fr.report_id,
      'found' AS report_type,
      fr.item_found AS name,
      fr.description,
      l.location_name AS location,
      fr.date_returned AS dateClaimed
    FROM found_reports fr
    LEFT JOIN locations l ON fr.location_id = l.location_id
    WHERE fr.status = 'Returned'
    
    UNION ALL
    
    SELECT 
      lr.lost_id AS report_id,
      'lost' AS report_type,
      lr.item_lost AS name,
      lr.other_description AS description,
      l.location_name AS location,
      lr.date_claimed AS dateClaimed
    FROM lost_reports lr
    LEFT JOIN locations l ON lr.location_id = l.location_id
    WHERE lr.status = 'found'
    
    ORDER BY dateClaimed DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

export default router;