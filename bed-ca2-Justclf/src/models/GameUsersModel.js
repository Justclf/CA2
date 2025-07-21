const pool = require('../services/db');


module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO gameuser (user_id, username)
    VALUES (?, ?);
    `;
  const VALUES = [data.user_id, data.username];

  pool.query(SQLSTATMENT, VALUES, callback);
}


module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT g.id, g.user_id, g.username, g.XP, g.user_rank, u.reputation
    FROM gameuser g
    JOIN User u ON g.user_id = u.id;
    `;

pool.query(SQLSTATMENT, callback);
}


module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT g.id, g.user_id, g.username, g.XP, g.user_rank, u.reputation
    FROM gameuser g
    JOIN User u ON g.user_id = u.id
    WHERE g.id = ?;
    `;
const VALUES = [data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

// Add this method to get user by user_id (for profile)
module.exports.selectByUserId = (data, callback) => {
    const SQLSTATMENT = `
    SELECT g.id, g.user_id, g.username, g.XP, g.user_rank, u.reputation
    FROM gameuser g
    JOIN User u ON g.user_id = u.id
    WHERE g.user_id = ?;
    `;
const VALUES = [data.user_id];
pool.query(SQLSTATMENT, VALUES, callback);
}




module.exports.challengePlayers = (data, callback) =>
{
// Get both players, ordered by rank strength, So rank S is index 0, hence highest
    const SQLSTATMENT = `
    SELECT id, user_rank
    FROM  gameuser
    WHERE id IN (?, ?)
    ORDER BY FIELD(
        user_rank,
        'S-Hunter',
        'A-Hunter',
        'B-Hunter',
        'C-Hunter',
        'D-Hunter',
        'E-Hunter'
    );
    `;
    const VALUES = [ data.challenger_id, data.opponent_id ];

    pool.query(SQLSTATMENT, VALUES, (error, results) =>
    {
        if (error) {
        return callback(error);
        }
        if (results.length < 2)
            return callback({ code: "USER_NOT_FOUND" });

// first row = winner, second row = loser
        const winner = results[0];
        const loser  = results[1];

        callback(null, {
            challenger_id: data.challenger_id,
            opponent_id: data.opponent_id,
            winner_id: winner.id,
            winner_rank: winner.user_rank,
            loser_id: loser.id,
            loser_rank: loser.user_rank,
            message: "Player " + results.winner_id + " wins!"
        });
    });
};