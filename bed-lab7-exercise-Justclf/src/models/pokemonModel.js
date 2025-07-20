const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT *
    FROM Pokemon;
    `;

pool.query(SQLSTATMENT, callback);
}



module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO Pokemon (owner_id, dex_num, hp, atk, def)
    VALUES (?, ?, ?, ?, ?);
    `;
const VALUES = [data.owner_id, data.dex_num, data.hp, data.atk, data.def];

pool.query(SQLSTATMENT, VALUES, callback);
}


module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM Pokemon
    WHERE id = ?;
    `;
const VALUES = [data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}