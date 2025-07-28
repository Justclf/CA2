const model = require("../models/questsProgressModel.js");
const gameUserModel = require("../models/GameUsersModel.js");

module.exports.GetCurrentQuests = (req, res, next) => {
    const userId = res.locals.userId

    const callbackgetgameuser = (error, results) => {
        if (error) {
            console.error("Error getting gameuser:", error);
            return res.status(500).json(error);
        }
        if (results.length === 0) {
            return res.status(404).json({message: "Game user not found"});
        }

        const gameUserId = results[0].id;

        const callback = (error, results) => {
            if (error) {
                console.error("Error getting current quests:", error);
                return res.status(500).json(error);
            }
            res.status(200).json(results)
        }
        model.currentQuests({user_id: gameUserId}, callback)
    }
    gameUserModel.selectByUserId({user_id: userId}, callbackgetgameuser)
}


module.exports.CompleteQuest = (req, res, next) => {
    const data = {
        user_id: res.locals.userId,
        id: req.params.questId
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error completing quest:", error);
            return res.status(500).json(error);
        }
        res.status(200).json({
            message: "Quest completed",
            xp: results.xp,
            rank: results.rank
        });
    }
    model.finishQuest(data, callback)
}