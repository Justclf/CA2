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