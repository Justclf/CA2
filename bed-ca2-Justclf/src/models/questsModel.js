const pool = require('../services/db');
const levels = require("../configs/levels.js")

module.exports.insertQuest = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO quests (title, description, xp_reward, recommended_rank)
    VALUES (?, ?, ?, ?)
    `;
    const VALUES = [data.title, data.description, data.xp_reward, data.recommended_rank];
    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.selectAll = (callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM quests;
    `;
    pool.query(SQLSTATEMENT, callback);
}

module.exports.selectById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM quests
    WHERE id = ?;
    `;
    const VALUES = [data.questId || data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE quests
    SET title = ?, 
        description = ?, 
        xp_reward = ?, 
        recommended_rank = ?
    WHERE id = ?;
    `;
    const VALUES = [data.title, data.description, data.xp_reward, data.recommended_rank, data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Add delete method
module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
    DELETE FROM quests
    WHERE id = ?;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
}

// Deduct XP from user when create quest
module.exports.deductUserXp = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE gameuser
    SET XP = XP - ? 
    WHERE user_id = ? AND XP >= ?
    `;

    const VALUES = [data.xp_amount, data.user_id, data.xp_amount];
    pool.query(SQLSTATEMENT, VALUES, callback);
}


// Retrieve the xp then store it in controller
module.exports.GetXpReward = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT q.xp_reward, gu.username
    FROM quests q
    CROSS JOIN gameuser gu
    WHERE q.id = ? AND gu.id = ?
    `;
    const VALUES = [data.quest_id, data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
}

// remove the old quest to allow replay
module.exports.removeCompletion = (data, callback) => {
    const SQLSTATEMENT = `
    DELETE FROM QuestCompletion
    WHERE user_id = ? AND quest_id = ?
    `;
    const VALUES = [data.user_id, data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// create the quest with 2 required fields
module.exports.StartingQuest = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO QuestStart (user_id, quest_id)
    VALUES (?, ?)
    `;
    const VALUES = [data.user_id, data.id];
    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.finishQuest = (data, callback) => {
    const SQLSTATEMENT_GET_GAMEUSER = `
    SELECT id
    FROM gameuser
    WHERE user_id = ?
    `;
    const VALUES_GET_GAMEUSER = [data.user_id];

    pool.query(SQLSTATEMENT_GET_GAMEUSER, VALUES_GET_GAMEUSER, (error, gameuserResults) => {
        if (error) return callback(error);
            if(gameuserResults.length === 0) {
                return callback({code: 'USER_NOT_FOUND', message: 'Game user not found'});
            }
        const gameUserId = gameuserResults[0].id;

        const SQLSTATEMENT_REMOVE_START = `
    DELETE FROM QuestStart
    WHERE user_id = ? AND quest_id = ?;
    `;
    const VALUES_REMOVE = [data.user_id, data.id];
    pool.query(SQLSTATEMENT_REMOVE_START, VALUES_REMOVE, (error1) => {
        if (error1) return callback(error1);

        // log completion
        const SQLSTATEMENT_LOG = `
        INSERT INTO QuestCompletion (user_id, quest_id)
        VALUES (?, ?);
        `;
        const VALUES_LOG = [data.user_id, data.id];
        pool.query(SQLSTATEMENT_LOG, VALUES_LOG, (error2) => {
            if (error2) return callback(error2);

            // give the xp to the player
            const SQLSTATEMENT_AWARD = `
            UPDATE GameUser
            SET xp = xp + (
                SELECT xp_reward
                FROM Quests
                WHERE id = ?
            )
            WHERE id = ?;
            `;
            const VALUES_AWARD = [data.id, data.user_id];
            pool.query(SQLSTATEMENT_AWARD, VALUES_AWARD, (error3) => {
                if (error3) return callback(error3);

                // get the new xp
                const SQLSTATEMENT_FETCH_XP = `
                SELECT xp
                FROM GameUser
                WHERE id = ?;
                `;
                const VALUES_FETCHXP = [data.user_id];
                pool.query(SQLSTATEMENT_FETCH_XP, VALUES_FETCHXP, (error4, rows) => {
                    if (error4) return callback(error4);
                    const newXp = rows[0].xp;

                    // calculate new level & xp to next
                    let newLevel = levels[0].name;
                    let xpToNext = 0;
                    for (let i = 0; i < levels.length; i++) {
                        if (newXp >= levels[i].xp) {
                            newLevel = levels[i].name;
                            if (i < levels.length - 1) {
                                xpToNext = levels[i + 1].xp - newXp;
                            }
                        } else {
                            break;
                        }
                    }

                    // update rank
                    const SQLSTATEMENT_UPDATE_RANK = `
                    UPDATE GameUser
                    SET user_rank = ?
                    WHERE id = ?;
                    `;
                    const VALUES_UPDATERANK = [newLevel, data.user_id];
                    pool.query(SQLSTATEMENT_UPDATE_RANK, VALUES_UPDATERANK, (error5) => {
                        if (error5) return callback(error5);

                        callback(null, {
                            xp: newXp, 
                            rank: newLevel, 
                            nextXp: xpToNext
                        });
                    });
                });
            });
        });
    });
});
}
