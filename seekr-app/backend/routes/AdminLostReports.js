import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
});


// Enable CORS for frontend
router.use(cors());
router.use(express.json());


// ✅ Helper function to normalize file path and check if file exists
const normalizeImagePath = (mediaPath) => {
  if (!mediaPath) return null;
 
  // If it's already a full URL, return it
  if (mediaPath.startsWith('http://')) {
    return mediaPath;
  }
 
  // Extract just the filename from the full path
  const filename = path.basename(mediaPath);
 
  // Build the full file system path
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const fullPath = path.join(uploadsDir, filename);
 
  // Check if file actually exists
  if (fs.existsSync(fullPath)) {
    // File exists, return the web URL
    return `/uploads/${filename}`;
  } else {
    // File doesn't exist, return null
    console.log(`⚠️ Image not found: ${fullPath}`);
    return null;
  }
};


// GET all lost reports with proper image handling
router.get('/lost-reports', (req, res) => {
  const query = `
    SELECT
      lr.lost_id,
      lr.item_lost,
      lr.other_description,
      lr.brand_lost,
      lr.location_description,
      lr.date_lost,
      lr.date_claimed,
      lr.status,
      lr.reason,
      c.color_name,
      l.location_name,
      CONCAT(u.fname_user, ' ', u.lname_user) as reported_by,
      CONCAT(ext_u.fname_ext, ' ', ext_u.lname_ext) as ext_reported_by,
      CONCAT(rev.fname_user, ' ', rev.lname_user) as reviewed_by,
      COALESCE(
        CONCAT(claim_user.fname_user, ' ', claim_user.lname_user),
        lr.claimed_by_name
      ) as claimed_by,
      im.media_path
    FROM lost_reports lr
    LEFT JOIN users u ON lr.lost_user = u.user_id
    LEFT JOIN external_users ext_u ON lr.external_lost_id = ext_u.external_id
    LEFT JOIN color c ON lr.color_id = c.color_id
    LEFT JOIN locations l ON lr.location_id = l.location_id
    LEFT JOIN users rev ON lr.reviewed_by = rev.user_id
    LEFT JOIN users claim_user ON lr.claimed_by = claim_user.user_id
    LEFT JOIN item_media im ON lr.media_id = im.media_id
    ORDER BY lr.date_lost DESC
  `;


  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching lost reports:', err);
      return res.status(500).json({ error: 'Database error' });
    }
   
    // ✅ Format the results with properly normalized image paths
    const formattedResults = results.map(item => {
      const imagePath = normalizeImagePath(item.media_path);
      const fullImageUrl = imagePath ? `http://localhost:5000${imagePath}` : null;
     
      // ✅ Determine reported by - check external first, then regular user
      let reportedBy = null;
      if (item.ext_reported_by) {
        reportedBy = item.ext_reported_by;
      } else if (item.reported_by) {
        reportedBy = item.reported_by;
      }
     
      if (item.media_path && !fullImageUrl) {
        console.log(`⚠️ Lost Report ${item.lost_id}: Image file not found for path: ${item.media_path}`);
      } else if (fullImageUrl) {
        console.log(`✅ Lost Report ${item.lost_id}: Image available at ${fullImageUrl}`);
      }
     
      return {
        lost_id: item.lost_id,
        item_lost: item.item_lost,
        other_description: item.other_description,
        brand_lost: item.brand_lost,
        location_description: item.location_description,
        date_lost: item.date_lost,
        date_claimed: item.date_claimed,
        status: item.status,
        reason: item.reason,
        color_name: item.color_name,
        location_name: item.location_name,
        reported_by: reportedBy,
        reviewed_by: item.reviewed_by,
        claimed_by: item.claimed_by,
        media_path: fullImageUrl
      };
    });
   
    res.json(formattedResults);
  });
});


// GET single lost report by ID with proper image handling
router.get('/lost-reports/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT
      lr.lost_id,
      lr.item_lost,
      lr.other_description,
      lr.brand_lost,
      lr.location_description,
      lr.date_lost,
      lr.date_claimed,
      lr.status,
      lr.reason,
      c.color_name,
      l.location_name,
      CONCAT(u.fname_user, ' ', u.lname_user) as reported_by,
      CONCAT(ext_u.fname_ext, ' ', ext_u.lname_ext) as ext_reported_by,
      CONCAT(rev.fname_user, ' ', rev.lname_user) as reviewed_by,
      COALESCE(
        CONCAT(claim_user.fname_user, ' ', claim_user.lname_user),
        lr.claimed_by_name
      ) as claimed_by,
      im.media_path
    FROM lost_reports lr
    LEFT JOIN users u ON lr.lost_user = u.user_id
    LEFT JOIN external_users ext_u ON lr.external_lost_id = ext_u.external_id
    LEFT JOIN color c ON lr.color_id = c.color_id
    LEFT JOIN locations l ON lr.location_id = l.location_id
    LEFT JOIN users rev ON lr.reviewed_by = rev.user_id
    LEFT JOIN users claim_user ON lr.claimed_by = claim_user.user_id
    LEFT JOIN item_media im ON lr.media_id = im.media_id
    WHERE lr.lost_id = ?
  `;


  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Error fetching lost report:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
   
    // ✅ Format the image path and check if file exists
    const report = results[0];
    const imagePath = normalizeImagePath(report.media_path);
    const fullImageUrl = imagePath ? `http://localhost:5000${imagePath}` : null;
   
    // ✅ Determine reported by - check external first, then regular user
    let reportedBy = null;
    if (report.ext_reported_by) {
      reportedBy = report.ext_reported_by;
    } else if (report.reported_by) {
      reportedBy = report.reported_by;
    }
   
    if (report.media_path && !fullImageUrl) {
      console.log(`⚠️ Lost Report ${report.lost_id}: Image file not found for path: ${report.media_path}`);
    } else if (fullImageUrl) {
      console.log(`✅ Lost Report ${report.lost_id}: Image available at ${fullImageUrl}`);
    }
   
    res.json({
      lost_id: report.lost_id,
      item_lost: report.item_lost,
      other_description: report.other_description,
      brand_lost: report.brand_lost,
      location_description: report.location_description,
      date_lost: report.date_lost,
      date_claimed: report.date_claimed,
      status: report.status,
      reason: report.reason,
      color_name: report.color_name,
      location_name: report.location_name,
      reported_by: reportedBy,
      reviewed_by: report.reviewed_by,
      claimed_by: report.claimed_by,
      media_path: fullImageUrl
    });
  });
});


// APPROVE a lost report (mark as found)
router.put('/lost-reports/:id/approve', (req, res) => {
  const { id } = req.params;
  const { reviewedBy } = req.body;


  const query = `
    UPDATE lost_reports
    SET status = 'found', reviewed_by = ?
    WHERE lost_id = ?
  `;


  db.query(query, [reviewedBy, id], (err, result) => {
    if (err) {
      console.error('❌ Error approving report:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log(`✅ Lost report ID ${id} approved by user ${reviewedBy}`);
    res.json({ message: 'Report approved successfully' });
  });
});


// REJECT lost report + update editable fields
router.put("/lost-reports/:id/reject", (req, res) => {
  const { id } = req.params;
  const {
    reviewedBy,
    reason,
    itemName,
    brand,
    color,
    description,
    location,
    locationDescription,
    date,
    reportedBy,
  } = req.body;


  // Get the color_id
  const getColorQuery = `SELECT color_id FROM color WHERE color_name = ? LIMIT 1`;
 
  db.query(getColorQuery, [color], (colorErr, colorResult) => {
    if (colorErr) {
      console.error("❌ Error finding color:", colorErr);
      return res.status(500).json({ error: "Database error" });
    }


    const colorId = colorResult.length > 0 ? colorResult[0].color_id : null;


    // Get the location_id
    const getLocationQuery = `SELECT location_id FROM locations WHERE location_name = ? LIMIT 1`;
   
    db.query(getLocationQuery, [location], (locErr, locResult) => {
      if (locErr) {
        console.error("❌ Error finding location:", locErr);
        return res.status(500).json({ error: "Database error" });
      }


      const locationId = locResult.length > 0 ? locResult[0].location_id : null;


      // Get the user_id for reportedBy (check both users and external_users)
      const getUserQuery = `
        SELECT user_id FROM users
        WHERE CONCAT(fname_user, ' ', lname_user) = ?
        LIMIT 1
      `;


      db.query(getUserQuery, [reportedBy], (userErr, userResult) => {
        if (userErr) {
          console.error("❌ Error finding user:", userErr);
          return res.status(500).json({ error: "Database error" });
        }


        if (userResult.length > 0) {
          // Found in users table
          const reportedByUserId = userResult[0].user_id;


          // Update with regular user
          const updateQuery = `
            UPDATE lost_reports
            SET
              item_lost = ?,
              brand_lost = ?,
              other_description = ?,
              location_description = ?,
              lost_user = ?,
              external_lost_id = NULL,
              color_id = ?,
              location_id = ?,
              reviewed_by = ?,
              reason = ?,
              status = 'reject'
            WHERE lost_id = ?
          `;


          db.query(
            updateQuery,
            [
              itemName,
              brand,
              description,
              locationDescription,
              reportedByUserId,
              colorId,
              locationId,
              reviewedBy,
              reason,
              id,
            ],
            (err, result) => {
              if (err) {
                console.error("❌ Error rejecting and updating report:", err);
                return res.status(500).json({ error: "Database error" });
              }


              console.log(`✅ Lost report ID ${id} rejected and updated by user ${reviewedBy}`);
              res.json({ message: "Report rejected & updated successfully!" });
            }
          );
        } else {
          // Not found in users, check external_users
          const getExternalUserQuery = `
            SELECT external_id FROM external_users
            WHERE CONCAT(fname_ext, ' ', lname_ext) = ?
            LIMIT 1
          `;


          db.query(getExternalUserQuery, [reportedBy], (extUserErr, extUserResult) => {
            if (extUserErr) {
              console.error("❌ Error finding external user:", extUserErr);
              return res.status(500).json({ error: "Database error" });
            }


            const externalUserId = extUserResult.length > 0 ? extUserResult[0].external_id : null;


            // Update with external user
            const updateQuery = `
              UPDATE lost_reports
              SET
                item_lost = ?,
                brand_lost = ?,
                other_description = ?,
                location_description = ?,
                lost_user = NULL,
                external_lost_id = ?,
                color_id = ?,
                location_id = ?,
                reviewed_by = ?,
                reason = ?,
                status = 'reject'
              WHERE lost_id = ?
            `;


            db.query(
              updateQuery,
              [
                itemName,
                brand,
                description,
                locationDescription,
                externalUserId,
                colorId,
                locationId,
                reviewedBy,
                reason,
                id,
              ],
              (err, result) => {
                if (err) {
                  console.error("❌ Error rejecting and updating report:", err);
                  return res.status(500).json({ error: "Database error" });
                }


                console.log(`✅ Lost report ID ${id} rejected and updated by user ${reviewedBy}`);
                res.json({ message: "Report rejected & updated successfully!" });
              }
            );
          });
        }
      });
    });
  });
});


// UPDATE lost report details
router.put('/lost-reports/:id', (req, res) => {
  const { id } = req.params;
  const {
    item_lost,
    other_description,
    color_id,
    brand_lost,
    location_id,
    date_lost,
    reported_by
  } = req.body;


  // Check if reported_by exists in users table first
  const getUserQuery = `
    SELECT user_id FROM users
    WHERE CONCAT(fname_user, ' ', lname_user) = ?
    LIMIT 1
  `;


  db.query(getUserQuery, [reported_by], (userErr, userResult) => {
    if (userErr) {
      console.error('❌ Error finding user:', userErr);
      return res.status(500).json({ error: 'Database error' });
    }


    if (userResult.length > 0) {
      // Found in users table
      const userId = userResult[0].user_id;
     
      const query = `
        UPDATE lost_reports
        SET
          item_lost = ?,
          other_description = ?,
          color_id = ?,
          brand_lost = ?,
          location_id = ?,
          date_lost = ?,
          lost_user = ?,
          external_lost_id = NULL
        WHERE lost_id = ?
      `;


      db.query(
        query,
        [item_lost, other_description, color_id, brand_lost, location_id, date_lost, userId, id],
        (err, result) => {
          if (err) {
            console.error('❌ Error updating report:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          console.log(`✅ Lost report ID ${id} updated successfully`);
          res.json({ message: 'Report updated successfully' });
        }
      );
    } else {
      // Check external_users table
      const getExternalUserQuery = `
        SELECT external_id FROM external_users
        WHERE CONCAT(fname_ext, ' ', lname_ext) = ?
        LIMIT 1
      `;


      db.query(getExternalUserQuery, [reported_by], (extErr, extResult) => {
        if (extErr) {
          console.error('❌ Error finding external user:', extErr);
          return res.status(500).json({ error: 'Database error' });
        }


        const externalUserId = extResult.length > 0 ? extResult[0].external_id : null;


        const query = `
          UPDATE lost_reports
          SET
            item_lost = ?,
            other_description = ?,
            color_id = ?,
            brand_lost = ?,
            location_id = ?,
            date_lost = ?,
            lost_user = NULL,
            external_lost_id = ?
          WHERE lost_id = ?
        `;


        db.query(
          query,
          [item_lost, other_description, color_id, brand_lost, location_id, date_lost, externalUserId, id],
          (err, result) => {
            if (err) {
              console.error('❌ Error updating report:', err);
              return res.status(500).json({ error: 'Database error' });
            }
            console.log(`✅ Lost report ID ${id} updated successfully`);
            res.json({ message: 'Report updated successfully' });
          }
        );
      });
    }
  });
});


export default router;
