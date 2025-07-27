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
module.exports.deductUserXP = (data, callback) => {
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
        const VALUES_REMOVE = [data.gameUserId, data.id];
        pool.query(SQLSTATEMENT_REMOVE_START, VALUES_REMOVE, (error1) => {
            if (error1) return callback(error1);

        
            const SQLSTATEMENT_COMPLETE = `
            INSERT INTO questcompletion (user_id, quest_id)
            VALUES (?, ?);
            `;
            const VALUES_LOG = [data.gameUserId, data.id];
            pool.query(SQLSTATEMENT_COMPLETE, VALUES_LOG, (error2) => {
                if (error2) return callback(error2);

                // give the xp to the player
                const SQLSTATEMENT_AWARD = `
                UPDATE gameuser
                SET xp = xp + (SELECT xp_reward FROM Quests WHERE id = ?)
                WHERE id = ?;
                `;
                const VALUES_AWARD = [data.id, data.gameUserId];
                pool.query(SQLSTATEMENT_AWARD, VALUES_AWARD, (error3) => {
                    if (error3) return callback(error3);

                // get the user updated info
                    const SQLSTATEMENT_USER = `
                    SELECT xp, user_rank
                    FROM gameuser
                    WHERE id = ?;
                    `;
                    const VALUES_FETCHXP = [data.gameUserId];
                    pool.query(SQLSTATEMENT_FETCH_XP, VALUES_FETCHXP, (error4, results) => {
                        if (error4) return callback(error4);
                        const newXp = rows[0].xp;

                        // calculate new rank based on xp
                        let newRank = 'E-Hunter';
                        if (newXp >= 2000) newRank = 'S-Hunter';
                        else if (newRank >= 1200)
                            newRank = 'A-Hunter';
                        else if (newRank >= 800)
                            newRank = 'B-Hunter';
                        else if (newXp >= 500)
                            newRank = 'C-Hunter';
                        else if (newXp >= 300)
                            newRank = 'D-Hunter';

                        if (newRank !== results[0].user_rank) {
                            const SQLSTATEMENT_RANK = `
                            UPDATE gameuser
                            SET user_rank = ?
                            WHERE id = ?;
                            `;

                            const VALUES_UPDATERANK = [newRank, gameUserId]
                            pool.query(SQLSTATEMENT_RANK, VALUES_UPDATERANK, (error5) => {
                                if (error5) return callback(error5);
                                callback(null, {xp: newXp, rank: newRank});
                            });
                        } else {
                            callback(null, {xp:newXp, rank: newRank}) //ai
                        }
                    });
                });
            });
        });
    });
}


// show the quests that the user accepted
module.exports.GetCurrentQuests = (data, callback) => {
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


module.exports.selectAvailableForUser = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT q.* 
    FROM quests q
    WHERE q.id NOT IN (
        SELECT quest_id 
        FROM QuestStart 
        WHERE user_id = ?
        UNION
        SELECT quest_id 
        FROM QuestCompletion
        WHERE user_id = ?
    )
    ORDER BY q.created_at DESC;
    `;
    const VALUES = [data.gameuser_id, data.gameuser_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
}

// show quest that are not started
module.exports.currentQuests = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT q.id, q.title, q.description, q.xp_reward, q.recommended_rank, q.created_at,
    'started' as status,
    qs.started_at
    FROM quests q
    INNER JOIN QuestStart qs ON q.id = qs.quest_id
    LEFT JOIN QuestCompletion qc ON q.id = qc.quest_id AND qc.user_id = qs.user_id
    WHERE qs.user_id = ? AND qc.quest_id IS NULL
    ORDER BY qs.started_at DESC;
    `;

    const VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
}