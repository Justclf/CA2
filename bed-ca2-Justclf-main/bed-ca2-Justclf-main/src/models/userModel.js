const pool = require('../services/db');

// Question 1
module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO user (username)
    VALUES (?);
    `;
  const VALUES = [data.username];

  pool.query(SQLSTATMENT, VALUES, callback);
}




// Quiestion 2
module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM user;
    `;

pool.query(SQLSTATMENT, callback);
}



// Question 3
module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM user
    WHERE id = ?;
    `;
const VALUES = [data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}



// Question 4
module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE user 
    SET username = ?, reputation = ?
    WHERE id = ?;
    `;
const VALUES = [data.username, data.reputation, data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}
