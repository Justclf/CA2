const model = require("../models/pvpModel.js");
const gameUserModel = require("../models/GameUsersModel.js");

// Get all available players for PVP
module.exports.getAvailablePlayers = (req, res, next) => {
    const userId = res.locals.userId;

    // First get current user's gameuser ID
    const callbackGetGameUser = (error, results) => {
        if (error) {
            console.error("Error getting gameuser:", error);
            return res.status(500).json(error);
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Game user not found" });
        }

        const currentGameUserId = results[0].id;

        // Get all other players
        const callback = (error, results) => {
            if (error) {
                console.error("Error getAvailablePlayers:", error);
                return res.status(500).json(error);
            }
            res.status(200).json(results);
        };

        model.getAvailablePlayers({ current_user_id: currentGameUserId }, callback);
    };

    gameUserModel.selectByUserId({ user_id: userId }, callbackGetGameUser);
};

// Challenge another player - simple version
module.exports.challengePlayer = (req, res, next) => {
    const userId = res.locals.userId;
    const opponentId = parseInt(req.body.opponent_id);

    if (!opponentId || isNaN(opponentId)) {
        return res.status(400).json({ message: "Valid opponent ID is required" });
    }

    // Get challenger's gameuser ID
    const callbackGetChallenger = (error, results) => {
        if (error) {
            console.error("Error getting challenger:", error);
            return res.status(500).json(error);
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Challenger not found" });
        }

        const challengerId = results[0].id;

        // Can't challenge yourself
        if (challengerId === opponentId) {
            return res.status(400).json({ message: "You cannot challenge yourself!" });
        }

        // Execute the simple battle
        const battleData = {
            challenger_id: challengerId,
            opponent_id: opponentId
        };

        const callback = (error, battleResult) => {
            if (error) {
                console.error("Error challengePlayer:", error);
                if (error.code === 'USER_NOT_FOUND') {
                    return res.status(404).json({ message: "One of the players was not found" });
                }
                return res.status(500).json(error);
            }

            res.status(201).json({
                message: "Battle completed!",
                winner: {
                    id: battleResult.winner_id,
                    name: battleResult.winner_name,
                    rank: battleResult.winner_rank
                },
                loser: {
                    id: battleResult.loser_id,
                    name: battleResult.loser_name,
                    rank: battleResult.loser_rank
                },
                result: battleResult.battle_result
            });
        };

        model.challengePlayers(battleData, callback);
    };

    gameUserModel.selectByUserId({ user_id: userId }, callbackGetChallenger);
};

// Get current user's PVP stats
module.exports.getPlayerStats = (req, res, next) => {
    const userId = res.locals.userId;

    const callback = (error, results) => {
        if (error) {
            console.error("Error getPlayerStats:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Player not found" });
        }

        const player = results[0];
        res.status(200).json({
            id: player.id,
            username: player.username,
            xp: player.XP,
            rank: player.user_rank
        });
    };

    gameUserModel.selectByUserId({ user_id: userId }, callback);
};