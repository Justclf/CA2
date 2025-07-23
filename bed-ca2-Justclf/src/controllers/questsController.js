const model = require("../models/questsModel.js");
const gameUserModel = require("../models/GameUsersModel.js")


module.exports.GetAllQuest = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error GetAllQuest:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}

module.exports.CreateQuest = (req, res, next) =>
{
    if(!req.body.questTitle || !req.body.questDescription || !req.body.questDifficulty)
    {
        res.status(400).json({message: "Missing required fields"});
        return;
    }
 
    const data = {
        title: req.body.questTitle,
        description: req.body.questDescription,
        xp_reward: req.body.questXP,
        recommended_rank: req.body.questDifficulty
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewuser:", error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: "Quest already exists" });
            }
                return res.status(500).json(error);
        }
            res.status(201).json({
                id: results.insertId,
                title: data.title,
                description: data.description,
                xp_reward: data.xp_reward,
                difficulty: data.recommended_rank,
                message: "Quest created successfully"
            });
    }

    model.insertQuest(data, callback);
}


module.exports.AcceptQuest = (req, res, next) =>
{
    const data = {
        id: req.params.questId,
        user_id: req.locals.userid // Take from JWT token
    }

    // 
    // const callbackRemoveComplete = (error, results, fields) => {
    //     if (error) {
    //         console.error("Error Removing old complete", error)
    //     }
    // }


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
            quest_id: data.id,
            user_id: data.user_id
        });
    }
    model.StartingQuest(data, callback);
}


module.exports.CompleteQuest = (req, res, next) => {
    const data = {
        user_id: res.locals.userId,
        id: req.params.id
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error Completing Quest:", error);
            return res.status(500).json(error);
        }
        res.status(200).json({
            message: "Quest completed successfully",
            xp: results.xp,
            rank: results.rank,
            nextXp: results.nextXp
        })
    }
    model.finishQuest(data, callback);
}




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