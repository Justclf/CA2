const pool = require('../services/db');

// Get available vulnerabilities (excluding ones user has already reported)
module.exports.getAvailableVulnerabilities = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT v.id, v.type, v.description, v.points, v.created_at
    FROM vulnerability v
    WHERE v.id NOT IN (
        SELECT r.vulnerability_id 
        FROM report r 
        WHERE r.user_id = ?
    )
    ORDER BY v.created_at DESC
    `;
    const VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Check if user already reported this vulnerability
module.exports.checkExistingReport = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT id FROM report
    WHERE user_id = ? AND vulnerability_id = ?
    `;
    const VALUES = [data.user_id, data.vulnerability_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get vulnerability by ID
module.exports.getVulnerabilityById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT id, type, points
    FROM vulnerability
    WHERE id = ?
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Create a new report (with default description)
module.exports.createReport = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO report (user_id, vulnerability_id, description)
    VALUES (?, ?, 'Report submitted via report page')
    `;
    const VALUES = [data.user_id, data.vulnerability_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Award XP to user
module.exports.awardXP = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE gameuser
    SET XP = XP + ?
    WHERE id = ?
    `;
    const VALUES = [data.xp_amount, data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get user's reports with vulnerability details
module.exports.getUserReports = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT r.id, r.status, r.user_id, r.description, v.type AS vulnerability_type, v.points, 
           r.created_at
    FROM report r
    JOIN vulnerability v ON r.vulnerability_id = v.id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
    `;
    const VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};