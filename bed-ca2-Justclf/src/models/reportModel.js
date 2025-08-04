const pool = require('../services/db');

// show all vuln except with status 1
module.exports.getAvailableVulnerabilities = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT v.id, v.type, v.description, v.points, v.created_at
    FROM vulnerability v
    WHERE v.id NOT IN (
        SELECT r.vulnerability_id 
        FROM report r 
        WHERE r.status = 1
    )
    ORDER BY v.created_at DESC
    `;
    pool.query(SQLSTATEMENT, callback);
};

// check if the report is 1
module.exports.checkClosedReport = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT id FROM report
    WHERE vulnerability_id = ? AND status = 1
    `;
    const VALUES = [data.vulnerability_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};


// get the vuln by id
module.exports.getVulnerabilityById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT id, type, points
    FROM vulnerability
    WHERE id = ?
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// create a new report and mark it with status 1
module.exports.createReport = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO report (user_id, vulnerability_id, description, status)
    VALUES (?, ?, 'Report submitted via report page', 1)
    `;
    const VALUES = [data.user_id, data.vulnerability_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// give XP to user
module.exports.awardXP = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE gameuser
    SET XP = XP + ?
    WHERE id = ?
    `;
    const VALUES = [data.xp_amount, data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// get users report
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