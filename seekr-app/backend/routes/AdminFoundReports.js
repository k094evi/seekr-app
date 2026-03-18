import express from "express";
import mysql from "mysql2";
import path from "path";


const router = express.Router();


// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "seekrapp",
});


// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


// Helper function to normalize file path for web serving
const normalizeImagePath = (mediaPath) => {
  if (!mediaPath) return null;
 
  // Extract just the filename from the full path
  const filename = path.basename(mediaPath);
 
  // Return the proper URL path
  return `/uploads/${filename}`;
};


// Helper function to get color_id from color_name
const getColorId = (colorName) => {
  return new Promise((resolve, reject) => {
    if (!colorName) {
      resolve(null);
      return;
    }
    db.query(
      "SELECT color_id FROM color WHERE color_name = ?",
      [colorName],
      (err, results) => {
        if (err) reject(err);
        else resolve(results.length > 0 ? results[0].color_id : null);
      }
    );
  });
};


// Helper function to get location_id from location_name
const getLocationId = (locationName) => {
  return new Promise((resolve, reject) => {
    if (!locationName) {
      resolve(null);
      return;
    }
    db.query(
      "SELECT location_id FROM locations WHERE location_name = ?",
      [locationName],
      (err, results) => {
        if (err) reject(err);
        else resolve(results.length > 0 ? results[0].location_id : null);
      }
    );
  });
};


// ✅ GET: Fetch all found reports with user details and status filtering
router.get("/admin/found-reports", (req, res) => {
  const { status, search, location, lostFound, sortBy } = req.query;


  let sql = `
    SELECT
      fr.report_id,
      fr.item_found,
      fr.description,
      fr.brand_found,
      fr.date_reported,
      fr.location_description,
      fr.status,
      fr.date_returned,
      fr.reason,
      fr.modified_time,
      fr.media_id,
      fr.claimed_by_name,
      c.color_name,
      l.location_name,
      u_founder.fname_user AS founder_fname,
      u_founder.lname_user AS founder_lname,
      ext_founder.fname_ext AS ext_founder_fname,
      ext_founder.lname_ext AS ext_founder_lname,
      u_claimer.fname_user AS claimer_fname,
      u_claimer.lname_user AS claimer_lname,
      u_reviewer.fname_user AS reviewer_fname,
      u_reviewer.lname_user AS reviewer_lname,
      im.media_path
    FROM found_reports fr
    LEFT JOIN color c ON fr.color_id = c.color_id
    LEFT JOIN locations l ON fr.location_id = l.location_id
    LEFT JOIN users u_founder ON fr.founded_user = u_founder.user_id
    LEFT JOIN external_users ext_founder ON fr.external_founded_id = ext_founder.external_id
    LEFT JOIN users u_claimer ON fr.claimed_by = u_claimer.user_id
    LEFT JOIN users u_reviewer ON fr.reviewed_by = u_reviewer.user_id
    LEFT JOIN item_media im ON fr.media_id = im.media_id
    WHERE 1=1
  `;


  const params = [];


  // ✅ Filter by status
  if (status) {
    if (status === "Pending") {
      sql += " AND fr.status = 'Pending'";
    } else if (status === "Claimed") {
      sql += " AND fr.status = 'Returned'";
    } else if (status === "Rejected") {
      sql += " AND fr.status = 'Rejected'";
    } else if (status === "Approved Missing") {
      sql += " AND fr.status = 'Missing'";
    }
  }


  // ✅ Search filter
  if (search) {
    sql += ` AND (
      fr.item_found LIKE ? OR
      fr.description LIKE ? OR
      fr.report_id LIKE ? OR
      CONCAT(u_founder.fname_user, ' ', u_founder.lname_user) LIKE ? OR
      CONCAT(ext_founder.fname_ext, ' ', ext_founder.lname_ext) LIKE ?
    )`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }


  // ✅ Location filter
  if (location) {
    const locations = location.split(",");
    sql += ` AND l.location_name IN (${locations.map(() => "?").join(",")})`;
    params.push(...locations);
  }


  // ✅ Sorting
  if (sortBy === "Item Name (A-Z)") {
    sql += " ORDER BY fr.item_found ASC";
  } else if (sortBy === "Location (A-Z)") {
    sql += " ORDER BY l.location_name ASC";
  } else if (sortBy === "Date (Newest to Oldest)") {
    sql += " ORDER BY fr.date_reported DESC";
  } else if (sortBy === "Date (Oldest to Newest)") {
    sql += " ORDER BY fr.date_reported ASC";
  } else {
    sql += " ORDER BY fr.date_reported DESC";
  }


  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }


    // ✅ Format response with properly normalized image paths
    const formattedResults = results.map((item) => {
      const imagePath = normalizeImagePath(item.media_path);
      const fullImageUrl = imagePath ? `http://localhost:5000${imagePath}` : null;
     
      console.log(`📸 Report ${item.report_id}: DB path = ${item.media_path}, Serving as = ${fullImageUrl}`);
     
      // ✅ Determine reported by - check external first, then regular user
      let reportedBy = "Unknown";
      if (item.ext_founder_fname && item.ext_founder_lname) {
        reportedBy = `${item.ext_founder_fname} ${item.ext_founder_lname}`;
      } else if (item.founder_fname && item.founder_lname) {
        reportedBy = `${item.founder_fname} ${item.founder_lname}`;
      }
     
      // ✅ Determine claimed by - check claimed_by_name first, then user lookup
      let claimedBy = "Unclaimed";
      if (item.claimed_by_name) {
        claimedBy = item.claimed_by_name;
      } else if (item.claimer_fname && item.claimer_lname) {
        claimedBy = `${item.claimer_fname} ${item.claimer_lname}`;
      }
     
      return {
        id: `F${String(item.report_id).padStart(4, "0")}`,
        itemName: item.item_found,
        brand: item.brand_found || "N/A",
        color: item.color_name || "N/A",
        lostFound: "Found",
        description: item.description || "No description",
        location: item.location_name || "Unknown",
        locationDescription: item.location_description || "No details",
        date: formatDate(item.date_reported),
        dateReported: formatDate(item.date_reported),
        reportedBy: reportedBy,
        reviewedBy: item.reviewer_fname
          ? `Admin ${item.reviewer_fname} ${item.reviewer_lname}`
          : "Not reviewed",
        reason: item.reason || "No reason provided",
        claimedBy: claimedBy,
        dateClaimed: formatDate(item.date_returned) || "N/A",
        approvedBy: item.reviewer_fname
          ? `Admin ${item.reviewer_fname} ${item.reviewer_lname}`
          : "Not approved",
        type:
          item.status === "Pending"
            ? "Pending"
            : item.status === "Returned"
            ? "Claimed"
            : item.status === "Rejected"
            ? "Rejected"
            : "Unclaimed",
        image: fullImageUrl,
        mediaId: item.media_id,
      };
    });


    res.json({ success: true, data: formattedResults });
  });
});


// ✅ PATCH: Approve a found report (mark as Missing) with edited data
router.patch("/admin/found-reports/:id/approve", async (req, res) => {
  const { id } = req.params;
  const { reviewed_by, editedData } = req.body;


  if (!reviewed_by) {
    return res.status(400).json({ success: false, error: "Reviewer ID required" });
  }


  try {
    // Get color_id and location_id if edited
    let colorId = null;
    let locationId = null;


    if (editedData) {
      if (editedData.color && editedData.color !== "N/A") {
        colorId = await getColorId(editedData.color);
      }
      if (editedData.location) {
        locationId = await getLocationId(editedData.location);
      }
    }


    // Build update query
    let updateFields = ["status = 'Missing'", "reviewed_by = ?", "modified_time = NOW()"];
    let updateParams = [reviewed_by];


    if (editedData) {
      if (editedData.itemName) {
        updateFields.push("item_found = ?");
        updateParams.push(editedData.itemName);
      }
      if (editedData.description) {
        updateFields.push("description = ?");
        updateParams.push(editedData.description);
      }
      if (editedData.brand) {
        updateFields.push("brand_found = ?");
        updateParams.push(editedData.brand);
      }
      if (colorId) {
        updateFields.push("color_id = ?");
        updateParams.push(colorId);
      }
      if (locationId) {
        updateFields.push("location_id = ?");
        updateParams.push(locationId);
      }
      if (editedData.locationDescription) {
        updateFields.push("location_description = ?");
        updateParams.push(editedData.locationDescription);
      }
    }


    updateParams.push(id);


    const sql = `UPDATE found_reports SET ${updateFields.join(", ")} WHERE report_id = ?`;


    db.query(sql, updateParams, (err, result) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ success: false, error: "Database error" });
      }


      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: "Report not found" });
      }


      res.json({ success: true, message: "Report approved successfully" });
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, error: "Failed to approve report" });
  }
});


// ✅ PATCH: Reject a found report with edited data
router.patch("/admin/found-reports/:id/reject", async (req, res) => {
  const { id } = req.params;
  const { reviewed_by, reason, editedData } = req.body;


  if (!reviewed_by || !reason) {
    return res
      .status(400)
      .json({ success: false, error: "Reviewer ID and reason required" });
  }


  try {
    // Get color_id and location_id if edited
    let colorId = null;
    let locationId = null;


    if (editedData) {
      if (editedData.color && editedData.color !== "N/A") {
        colorId = await getColorId(editedData.color);
      }
      if (editedData.location) {
        locationId = await getLocationId(editedData.location);
      }
    }


    // Build update query
    let updateFields = [
      "status = 'Rejected'",
      "reviewed_by = ?",
      "reason = ?",
      "modified_time = NOW()",
    ];
    let updateParams = [reviewed_by, reason];


    if (editedData) {
      if (editedData.itemName) {
        updateFields.push("item_found = ?");
        updateParams.push(editedData.itemName);
      }
      if (editedData.description) {
        updateFields.push("description = ?");
        updateParams.push(editedData.description);
      }
      if (editedData.brand) {
        updateFields.push("brand_found = ?");
        updateParams.push(editedData.brand);
      }
      if (colorId) {
        updateFields.push("color_id = ?");
        updateParams.push(colorId);
      }
      if (locationId) {
        updateFields.push("location_id = ?");
        updateParams.push(locationId);
      }
      if (editedData.locationDescription) {
        updateFields.push("location_description = ?");
        updateParams.push(editedData.locationDescription);
      }
    }


    updateParams.push(id);


    const sql = `UPDATE found_reports SET ${updateFields.join(", ")} WHERE report_id = ?`;


    db.query(sql, updateParams, (err, result) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ success: false, error: "Database error" });
      }


      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: "Report not found" });
      }


      res.json({ success: true, message: "Report rejected successfully" });
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ success: false, error: "Failed to reject report" });
  }
});


// ✅ PATCH: Mark report as Returned (when claimed) with password verification
router.patch("/admin/found-reports/:id/return", (req, res) => {
  const { id } = req.params;
  const { claimed_by, reviewed_by, date_claimed, admin_password } = req.body;


  console.log("📥 Received claim request:", {
    id,
    claimed_by,
    reviewed_by,
    date_claimed,
    admin_password: admin_password ? "***" : "MISSING"
  });


  // ✅ Validate all required fields
  if (!claimed_by || !reviewed_by || !admin_password) {
    console.log("❌ Missing required fields");
    return res.status(400).json({
      success: false,
      error: "Claimer name, reviewer ID, and password required"
    });
  }


  // ✅ FIRST: Verify admin password BEFORE doing anything else
  const passwordQuery = "SELECT password_user, email_user, fname_user, lname_user FROM users WHERE user_id = ?";
 
  db.query(passwordQuery, [reviewed_by], (err, results) => {
    if (err) {
      console.error("❌ Database error checking password:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }


    if (results.length === 0) {
      console.log("❌ User not found with ID:", reviewed_by);
      return res.status(404).json({ success: false, error: "User not found" });
    }


    const storedPassword = results[0].password_user;
    const userInfo = {
      email: results[0].email_user,
      name: `${results[0].fname_user} ${results[0].lname_user}`
    };
   
    console.log("🔐 PASSWORD VERIFICATION CHECK:");
    console.log("   User ID:", reviewed_by);
    console.log("   User:", userInfo.name, `(${userInfo.email})`);
    console.log("   Password provided:", `"${admin_password}"`);
    console.log("   Password stored:", `"${storedPassword}"`);
    console.log("   Exact match:", admin_password === storedPassword);
   
    // ✅ CRITICAL: Verify password matches - STOP HERE if incorrect
    if (admin_password !== storedPassword) {
      console.log("❌❌❌ INCORRECT PASSWORD - BLOCKING UPDATE ❌❌❌");
      return res.status(401).json({
        success: false,
        error: "Incorrect admin password"
      });
    }


    console.log("✅✅✅ PASSWORD VERIFIED SUCCESSFULLY - PROCEEDING WITH CLAIM ✅✅✅");


    // ✅ Parse the claimer's name
    const nameParts = claimed_by.trim().split(' ');
    const fname = nameParts[0];
    const mname = nameParts.length > 2 ? nameParts[1] : '';
    const lname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
   
    // ✅ Try to find existing user by matching fname, mname, or lname
    let userQuery = "SELECT user_id FROM users WHERE fname_user = ? OR lname_user = ?";
    let queryParams = [fname, lname];
   
    if (mname) {
      userQuery = "SELECT user_id FROM users WHERE fname_user = ? OR mname_user = ? OR lname_user = ?";
      queryParams = [fname, mname, lname];
    }
   
    db.query(userQuery, queryParams, (userErr, userResults) => {
      if (userErr) {
        console.error("❌ Database error finding user:", userErr);
        return res.status(500).json({ success: false, error: "Database error" });
      }
     
      let claimerUserId = null;
      let claimerName = claimed_by.trim();
     
      if (userResults.length > 0) {
        // ✅ User found - use their user_id
        claimerUserId = userResults[0].user_id;
        console.log("✅ Found existing claimer user ID:", claimerUserId);
      } else {
        // ✅ User NOT found - will store name only
        console.log("ℹ️ No matching user found - storing name directly:", claimerName);
      }
     
      // ✅ Update the report with either user_id OR name
      const updateSql = `
        UPDATE found_reports
        SET status = 'Returned',
            claimed_by = ?,
            claimed_by_name = ?,
            reviewed_by = ?,
            date_returned = ?,
            modified_time = NOW()
        WHERE report_id = ?
      `;


      console.log("📤 Executing SQL update with params:", [
        claimerUserId,
        claimerUserId ? null : claimerName,
        reviewed_by,
        date_claimed,
        id
      ]);


      db.query(
        updateSql,
        [claimerUserId, claimerUserId ? null : claimerName, reviewed_by, date_claimed, id],
        (updateErr, result) => {
          if (updateErr) {
            console.error("❌ Database error updating report:", updateErr);
            return res.status(500).json({ success: false, error: "Database error" });
          }


          console.log("✅ SQL result:", result);


          if (result.affectedRows === 0) {
            console.log("❌ No rows affected - report not found");
            return res.status(404).json({ success: false, error: "Report not found" });
          }


          console.log("🎉 Report successfully marked as returned");
          res.json({ success: true, message: "Report marked as returned" });
        }
      );
    });
  });
});


// ✅ PATCH: Mark report as Returned AND link with lost report (UPDATED WITH CLAIMED_BY_NAME)
router.patch("/admin/found-reports/:id/return-with-link", (req, res) => {
  const { id } = req.params;
  const { claimed_by, reviewed_by, date_claimed, admin_password, lost_report_id } = req.body;


  console.log("📥 Received linked claim request:", {
    id,
    claimed_by,
    reviewed_by,
    date_claimed,
    lost_report_id,
    admin_password: admin_password ? "***" : "MISSING"
  });


  // ✅ Validate all required fields
  if (!claimed_by || !reviewed_by || !admin_password) {
    console.log("❌ Missing required fields");
    return res.status(400).json({
      success: false,
      error: "Claimer name, reviewer ID, and password required"
    });
  }


  // ✅ FIRST: Verify admin password
  const passwordQuery = "SELECT password_user, email_user, fname_user, lname_user FROM users WHERE user_id = ?";
 
  db.query(passwordQuery, [reviewed_by], (err, results) => {
    if (err) {
      console.error("❌ Database error checking password:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }


    if (results.length === 0) {
      console.log("❌ User not found with ID:", reviewed_by);
      return res.status(404).json({ success: false, error: "User not found" });
    }


    const storedPassword = results[0].password_user;
   
    if (admin_password !== storedPassword) {
      console.log("❌ INCORRECT PASSWORD");
      return res.status(401).json({
        success: false,
        error: "Incorrect admin password"
      });
    }


    console.log("✅ PASSWORD VERIFIED - PROCEEDING WITH LINKED CLAIM");


    // ✅ Parse the claimer's name
    const nameParts = claimed_by.trim().split(' ');
    const fname = nameParts[0];
    const mname = nameParts.length > 2 ? nameParts[1] : '';
    const lname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
   
    // ✅ Try to find existing user
    let userQuery = "SELECT user_id FROM users WHERE fname_user = ? OR lname_user = ?";
    let queryParams = [fname, lname];
   
    if (mname) {
      userQuery = "SELECT user_id FROM users WHERE fname_user = ? OR mname_user = ? OR lname_user = ?";
      queryParams = [fname, mname, lname];
    }
   
    db.query(userQuery, queryParams, (userErr, userResults) => {
      if (userErr) {
        console.error("❌ Database error finding user:", userErr);
        return res.status(500).json({ success: false, error: "Database error" });
      }
     
      let claimerUserId = null;
      let claimerName = claimed_by.trim();
     
      if (userResults.length > 0) {
        claimerUserId = userResults[0].user_id;
        console.log("✅ Found existing claimer user ID:", claimerUserId);
      } else {
        console.log("ℹ️ No matching user found - storing name directly:", claimerName);
      }
     
      const updateBothReports = () => {
        // Start transaction
        db.beginTransaction((transErr) => {
          if (transErr) {
            console.error("❌ Transaction error:", transErr);
            return res.status(500).json({ success: false, error: "Transaction error" });
          }


          // Update found report
          const updateFoundSql = `
            UPDATE found_reports
            SET status = 'Returned',
                claimed_by = ?,
                claimed_by_name = ?,
                reviewed_by = ?,
                date_returned = ?,
                modified_time = NOW()
            WHERE report_id = ?
          `;


          db.query(
            updateFoundSql,
            [claimerUserId, claimerUserId ? null : claimerName, reviewed_by, date_claimed, id],
            (foundErr) => {
              if (foundErr) {
                return db.rollback(() => {
                  console.error("❌ Error updating found report:", foundErr);
                  res.status(500).json({ success: false, error: "Failed to update found report" });
                });
              }


              console.log("✅ Found report updated successfully");


              // If lost_report_id is provided, update the lost report too WITH claimed_by_name
              if (lost_report_id) {
                const updateLostSql = `
                  UPDATE lost_reports
                  SET status = 'found',
                      claimed_by = ?,
                      claimed_by_name = ?,
                      reviewed_by = ?,
                      date_claimed = ?
                  WHERE lost_id = ?
                `;


                db.query(
                  updateLostSql,
                  [claimerUserId, claimerUserId ? null : claimerName, reviewed_by, date_claimed, lost_report_id],
                  (lostErr) => {
                    if (lostErr) {
                      return db.rollback(() => {
                        console.error("❌ Error updating lost report:", lostErr);
                        res.status(500).json({ success: false, error: "Failed to update lost report" });
                      });
                    }


                    console.log("✅ Lost report updated successfully with claimer name:", claimerName);


                    // Commit transaction
                    db.commit((commitErr) => {
                      if (commitErr) {
                        return db.rollback(() => {
                          console.error("❌ Commit error:", commitErr);
                          res.status(500).json({ success: false, error: "Commit error" });
                        });
                      }


                      console.log("🎉 Both reports successfully claimed and linked with claimer name");
                      res.json({
                        success: true,
                        message: "Both reports marked as claimed and linked successfully"
                      });
                    });
                  }
                );
              } else {
                // No lost report to link, just commit the found report update
                db.commit((commitErr) => {
                  if (commitErr) {
                    return db.rollback(() => {
                      console.error("❌ Commit error:", commitErr);
                      res.status(500).json({ success: false, error: "Commit error" });
                    });
                  }


                  console.log("🎉 Found report successfully claimed");
                  res.json({
                    success: true,
                    message: "Report marked as claimed successfully"
                  });
                });
              }
            }
          );
        });
      };
     
      updateBothReports();
    });
  });
});


export default router;