const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT *
    FROM pokedex;
    `;

pool.query(SQLSTATMENT, callback);
}