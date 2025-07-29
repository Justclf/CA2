const model = require("../models/questsModel.js");
const gameUserModel = require("../models/GameUsersModel.js")


module.exports.GetAllQuest = (req, res, next) => {
    // Get userId from token if available
    const userId = res.locals.userId;
    
    if (!userId) {
        // No user logged in, return empty array
        return res.status(200).json([]);
    }

    // Get gameuser first
    const gameUserModel = require("../models/GameUsersModel.js");
    
    const callbackgetgameuser = (error, results) => {
        if (error) {
            console.error("Error getting gameuser:", error);
            return res.status(500).json(error);
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Game user not found" });
        }

        const gameUserId = results[0].id;

        // Get available quests for this user
        const callback = (error, results) => {
            if (error) {
                console.error("Error GetAllQuest:", error);
                return res.status(500).json(error);
            }
            res.status(200).json(results);
        }

        model.selectAvailableForUser({ gameuser_id: gameUserId }, callback);
    };

    gameUserModel.selectByUserId({ user_id: userId }, callbackgetgameuser);
}


module.exports.CreateQuest = (req, res, next) => {
    if(!req.body.questTitle || !req.body.questDescription || !req.body.questDifficulty)
    {
        res.status(400).json({message: "Missing required fields"});
        return;
    }

    const userId = res.locals.userId;
    const xpCost = parseInt(req.body.questXP) || 1

    // Get the gameusers data to check the XP
    const callbackCheckXP = (error, results) => {
        if (error) {
            console.error("Error getting user data:" , error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({message: "Game user not found"});
        }

        const currentXP = results[0].XP;
        if (currentXP < xpCost) {
            return res.status(400).json({message: `Insufficient XP. You have ${currentXP} XP`})
        }
        
        const data = {
            title: req.body.questTitle,
            description: req.body.questDescription,
            xp_reward: req.body.questXP,
            recommended_rank: req.body.questDifficulty,
        }

        // create quest first, then deduct xp
        const callbackCreateQuest = (error2, results2) => {
            if (error2) {
                console.error("Error creating quest:", error2);
                if (error2.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: "Quest already exists" });
                }
                return res.status(500).json(error2);
            }

            // Right after quest is created, deduct the xp
            const callbackDeductXP = (error3, results3) => {
                if (error3) {
                    console.error("Error deducting XP:", error3);
                    return res.status(500).json({message: "Quest created but failed to deduct XP. Please try again"})
                }
                console.log("XP deducted.", results3)
                const newXP = currentXP - xpCost;
                res.status(201).json({
                    id: results2.insertId,
                    title: data.title,
                    description: data.description,
                    xp_reward: data.xp_reward,
                    difficulty: data.recommended_rank,
                    newXP: newXP,
                    message: "Quest created successfully"
                });
            };
            model.deductUserXP({user_id: userId, xp_amount: xpCost}, callbackDeductXP);
        };
        model.insertQuest(data, callbackCreateQuest);
    };
    gameUserModel.selectByUserId({user_id: userId}, callbackCheckXP);
};


module.exports.AcceptQuest = (req, res, next) =>
{
    const data = {
        id: req.params.questId,
        user_id: res.locals.userId
    }

    const callbackgetgameuser = (error, results) => {
        if (error) {
            console.error("Error getting gameuser:", error);
            return res.status(500).json(error);
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Game user not found" });
        }

        const gameUserId = results[0].id;
        const questData = {
            id: data.id,
            user_id: gameUserId
        };

        const callback = (error, results) => {
            if (error) {
                console.error("Error AcceptQuest:", error);
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: "Quest already started" });
                } else {
                    return res.status(500).json(error);
                }
            }
            res.status(200).json({
                message: "Quest accepted successfully",
                quest_id: questData.id,
                user_id: questData.user_id
            });
        }
        
        model.StartingQuest(questData, callback);
    };
    gameUserModel.selectByUserId({ user_id: data.user_id }, callbackgetgameuser);
}

// module.exports.CompleteQuest = (req, res, next) => {
//     const data = {
//         user_id: res.locals.userId,
//         id: req.params.id
//     }
// 
//     const callback = (error, results) => {
//         if (error) {
//             console.error("Error Completing Quest:", error);
//             return res.status(500).json(error);
//         }
//         res.status(200).json({
//             message: "Quest completed successfully",
//             xp: results.xp,
//             rank: results.rank,
//             nextXp: results.nextXp
//         })
//     }
//     model.finishQuest(data, callback);
// }


module.exports.DeleteQuest = (req, res, next) => {
    const data = {
        questId: req.params.id
    }

    const callbackCheck = (error, results) => {
        if (error) {
            console.error("Error checking quest:", error)
            return res.status(500).json(error)
        } else {
            if (results.length == 0) {
                return res.status(404).json({message: "Quest not found"})
            }
        }

        const callbackDelete = (error2, results2) => {
            if (error2) {
                console.error("Error deleting quest:", error2)
                return res.status(500).json(error2)   
            }
            res.status(200).json({message: "Quest deleted successfully"})
        }
        model.deleteById({id: data.questId}, callbackDelete)
    }
    model.selectById(data, callbackCheck);
}


// Get the profile to show information
module.exports.GetUserProfile = (req, res, next) => {
    const userId = res.locals.userId; // From JWT token

    const callback = (error, results) => {
        if (error) {
            console.error("Error GetUserProfile:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];
        res.status(200).json({
            username: user.username,
            xp: user.XP,
            rank: user.user_rank,
            reputation: user.reputation
        });
    }

    gameUserModel.selectByUserId({ user_id: userId }, callback);
}



module.exports.GetCurrentQuests = (req, res, next) => {
    const userId = res.locals.userId; // From JWT token

    // First get the gameuser ID
    const callbackgetgameuser = (error, results) => {
        if (error) {
            console.error("Error getting gameuser:", error);
            return res.status(500).json(error);
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Game user not found" });
        }

        const gameUserId = results[0].id;

        // Now get current quests for this gameuser
        const callback = (error, results) => {
            if (error) {
                console.error("Error GetCurrentQuests:", error);
                return res.status(500).json(error);
            }
            res.status(200).json(results);
        }

        model.GetCurrentQuests({ user_id: gameUserId }, callback);
    };

    gameUserModel.selectByUserId({ user_id: userId }, callbackgetgameuser);
}