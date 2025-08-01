const pool = require('../services/db');
const levels = require("../configs/levels.js")


module.exports.currentQuests = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT q.id, q.title, q.description, q.xp_reward, q.recommended_rank, q.created_at,
    CASE
        WHEN qc.quest_id IS NOT NULL THEN 'completed'
        WHEN qs.quest_id IS NOT NULL THEN 'started'
        ELSE 'available'
    END as status,
    qs.started_at,
    qc.completed_at
    FROM quests q
    LEFT JOIN QuestStart qs
        ON q.id = qs.quest_id AND qs.user_id = ?
    LEFT JOIN QuestCompletion qc 
        ON q.id = qc.quest_id AND qc.user_id = ?
    WHERE qs.quest_id IS NOT NULL OR qc.quest_id IS NOT NULL
    ORDER BY 
    CASE
        WHEN qc.quest_id IS NOT NULL THEN qc.completed_at
        WHEN qs.quest_id IS NOT NULL THEN qs.started_at
    END DESC;
    `;

    const VALUES = [data.user_id, data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback)
}


// complete button
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
// Remove start quests
    const SQLSTATEMENT_REMOVE_START = `
        DELETE FROM QuestStart
        WHERE user_id = ? AND quest_id = ?;
    `;
    const VALUES_REMOVE = [gameUserId, data.id];
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
            SET xp = xp + (SELECT xp_reward FROM Quests WHERE id = ?)
            WHERE id = ?;
            `;
            const VALUES_AWARD = [data.id, gameUserId];
            pool.query(SQLSTATEMENT_AWARD, VALUES_AWARD, (error3) => {
                if (error3) return callback(error3);

                // get the new xp
                const SQLSTATEMENT_FETCH_XP = `
                SELECT xp
                FROM GameUser
                WHERE id = ?;
                `;
                const VALUES_FETCHXP = [gameUserId];
                pool.query(SQLSTATEMENT_FETCH_XP, VALUES_FETCHXP, (error4, rows) => {
                    if (error4) return callback(error4);
                    const newXp = rows[0].xp;

                    // calculate new level & xp to next
                    let newLevel = levels[0].name;
                    for (let i = 0; i < levels.length; i++) {
                        if (newXp >= levels[i].xp) {
                            newLevel = levels[i].name;
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
                    const VALUES_UPDATERANK = [newLevel, gameUserId];
                    pool.query(SQLSTATEMENT_UPDATE_RANK, VALUES_UPDATERANK, (error5) => {
                        if (error5) return callback(error5);

                        callback(null, {
                            xp: newXp, 
                            rank: newLevel, 
                        });
                    });
                });
            });
        });
    });
});
}