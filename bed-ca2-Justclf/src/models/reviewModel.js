const { values } = require('../configs/levels');
const pool = require('../services/db');

module.exports.selectALL = (callback) => {
    const SQLSTATEMENT = `
    SELECT rating, comment, created_at 
    FROM review 
    `;
    
    pool.query(SQLSTATEMENT, callback);
}


module.exports.insertSingle = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO Reviews (rating, comment, user_id)
    VALUES (?, ?, ?)
    `;

    const VALUES = [data.rating, data.comment, data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}


module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE Reviews
    SET rating = ?, comment =?
    WHERE id = ? AND user_id = ?;
    `;

    const VALUES = [data.rating, data.comment, data.id, data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}

module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
    DELETE FROM Reviews
    WHERE id = ? AND user_id = ?;
    `;

    const VALUES = [data.id, data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}