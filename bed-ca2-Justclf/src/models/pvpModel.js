const pool = require('../services/db');

// get all users other than urself
module.exports.getAvailablePlayers = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT g.id, g.username, g.user_rank
    FROM gameuser g
    WHERE g.id != ?
    ORDER BY g.username;
    `;
    const VALUES = [data.current_user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// fight other players
module.exports.challengePlayers = (data, callback) => {
    // Order by strength
    const SQLSTATEMENT = `
    SELECT id, username, user_rank
    FROM gameuser
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
    const VALUES = [data.challenger_id, data.opponent_id];

    pool.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) {
            return callback(error);
        }
        if (results.length < 2) {
            return callback({ code: "USER_NOT_FOUND" });
        }

        const winner = results[0];
        const loser = results[1];

        callback(null, {
            challenger_id: data.challenger_id,
            opponent_id: data.opponent_id,
            winner_id: winner.id,
            winner_name: winner.username,
            winner_rank: winner.user_rank,
            loser_id: loser.id,
            loser_name: loser.username,
            loser_rank: loser.user_rank,
            battle_result: `${winner.username} defeats ${loser.username}!`
        });
    });
};