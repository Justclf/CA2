const pool = require('../services/db');


module.exports.GetVulnerabilityById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT id, type, points
    FROM vulnerability
    WHERE id = ?
    `
    const VALUES = [data.id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}

module.exports.CreateReport = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO report (user_id, vulnerability_id, description)
    VALUES (?, ?, ?)
    `
    const VALUES = [data.user_id, data.vulnerability_id, data.description]
    pool.query(SQLSTATEMENT, VALUES, callback)
}

// Updated to work with GameUser XP instead of User reputation
module.exports.UpdateReputation = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE gameuser
    SET XP = XP + ?
    WHERE id = ?
    `
    const VALUES = [data.reputation, data.id] // reputation here means XP points to add
    pool.query(SQLSTATEMENT, VALUES, callback)
}

// Get user's reports with vulnerability details
module.exports.getUserReports = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT r.id, r.status, r.user_id, r.description, v.type AS vulnerability_type, v.points, 
        DATE_FORMAT(NOW(), '%d %M %Y') AS created_at
    FROM report r
    JOIN vulnerability v ON r.vulnerability_id = v.id
    WHERE r.user_id = ?
    ORDER BY r.id DESC
    `
    const VALUES = [data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}

