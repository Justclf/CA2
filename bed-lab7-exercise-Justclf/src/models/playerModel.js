const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM Player;
    `;

pool.query(SQLSTATMENT, callback);
}

module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM player
    WHERE id = ?;
    `;
const VALUES = [data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

// module.exports.insertSingle = (data, callback) =>
// {
//     const SQLSTATMENT = `
//     INSERT INTO Player (name, level)
//     VALUES (?, ?);
//     `;
// const VALUES = [data.name, data.level];
// 
// pool.query(SQLSTATMENT, VALUES, callback);
// }
// 
// module.exports.updateById = (data, callback) =>
// {
//     const SQLSTATMENT = `
//     UPDATE Player 
//     SET name = ?, level = ?
//     WHERE id = ?;
//     `;
// const VALUES = [data.name, data.level, data.id];
// 
// pool.query(SQLSTATMENT, VALUES, callback);
// }
// 
// module.exports.deleteById = (data, callback) =>
// {
//     const SQLSTATMENT = `
//     DELETE FROM Player 
//     WHERE id = ?;
//     `;
// const VALUES = [data.id];
// 
// pool.query(SQLSTATMENT, VALUES, callback);
// }
// 
