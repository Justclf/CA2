const pool = require('../services/db');


// Question 7



module.exports.GetUserById = (data, callback) =>
{
    const SQLSTATEMENT = `
    SELECT id, reputation
    FROM user
    WHERE id = ?
    `
    const VALUES = [data.id]

    pool.query(SQLSTATEMENT, VALUES, callback)
}


module.exports.GetVulnerabilityById = (data, callback) =>
{
    const SQLSTATEMENT = `
    SELECT id, points
    FROM vulnerability
    WHERE id = ?
    `
    const VALUES = [data.id]

    pool.query(SQLSTATEMENT, VALUES, callback)
}


module.exports.CreateReport = (data, callback) =>
{
    const SQLSTATEMENT = `
    INSERT INTO report (user_id, vulnerability_id)
    VALUES (?, ?)
    `
    const VALUES = [data.user_id, data.vulnerability_id]

    pool.query(SQLSTATEMENT, VALUES, callback)
}


module.exports.UpdateReputation = (data, callback) =>
{
    const SQLSTATEMENT = `
    UPDATE user
    SET reputation = ?
    WHERE id = ?
    `
    const VALUES = [data.reputation, data.id]

    pool.query(SQLSTATEMENT, VALUES, callback)
}




// Question 8

// Check if the report exists
module.exports.CheckReportById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT id
    FROM report
    WHERE id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}


// Check if user exists
module.exports.CheckUserById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT id 
    FROM user
    WHERE id = ?
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}



// Update the report and reputation
module.exports.UpdateReportAndReputation = (data, callback) =>
{
    const SQLSTATEMENT = `
    UPDATE report
    JOIN vulnerability ON vulnerability.id = report.vulnerability_id
    JOIN user ON user.id = ? -- The one who's closing the report
    SET user.reputation = user.reputation + vulnerability.points,
    report.status = ?,
    report.user_id = ?

    WHERE report.id = ?;
        
    SELECT reputation AS user_reputation 
    FROM user
    WHERE id = ?;
    `;
        
// Selecting the user.id from user, Mark it closed on request body, then record who closed it, filter that specific report id, lastly it selects the reputation from user
    const VALUES = [data.user_id, data.status, data.user_id, data.id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, (error, results) =>
    {
        if (error) {
            return callback(error);
        }

        const newRep = results[1][0].user_reputation; // Selecting the 2nd result from the first row with user_reputation, then store it in newRep
        callback(null, { affectedRows: results[0].affectedRows, newRep }); // How many rows affected(2), and define the newRep
    });
};