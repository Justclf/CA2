const model = require("../models/questsModel.js");
const levels = require("../configs/levels.js")

// Creating the quests
module.exports.CreateQuests = (req, res, next) =>
{
    const { title, description, xp_reward, recommended_rank } = req.body;

    if(!title || !description || xp_reward == null || !recommended_rank)
    {
        res.status(400).send("Error: Title, description, xp_reward or recommended_rank is undefined");
        return;
    }
 
    const data = { title, description, xp_reward: Number(xp_reward), recommended_rank };

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
                recommended_rank: data.recommended_rank
            });
    }

    model.insertQuest(data, callback);
}


// Get all the quests
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

module.exports.GetQuestsById = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error GetGameUsersById:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
            else res.status(200).json(results[0]);
        }
    }

    model.selectById(data, callback);
}


module.exports.UpdateQuest = (req, res, next) =>
{
    if(req.body.title == undefined || req.body.description == undefined || req.body.xp_reward == undefined || req.body.recommended_rank == undefined)
    {
        res.status(400).send("Error: Title, description, xp reward or recommended rank is undefined");
        return;
    }

    const data = {
        id: Number(req.params.id), 
        title: req.body.title,
        description: req.body.description,
        xp_reward: req.body.xp_reward,
        recommended_rank: req.body.recommended_rank
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error UpdateQuest:", error);
            if (error.code === 'ER_DUP_ENTRY') { 
                return res.status(409).json({ error: "Quest already exists" });
            } else {
                return res.status(500).json(error);
            }
        }

            if (results.affectedRows == 0) {
                res.status(404).json({message: "Quest not found"});
            }
            res.status(200).json({
                id: data.id,
                title: data.title,
                description: data.description,
                xp_reward: data.xp_reward,
                recommended_rank: data.recommended_rank
            });
        }

    model.updateById(data, callback);
}


// Middleware to load the XP and Username
module.exports.LoadXp = (req, res, next) =>
{
    if(req.body.user_id == undefined)
    {
        res.status(400).send("Error: User_id is undefined");
        return;
    }
    
    const data = {
        quest_id: Number(req.params.id),
        user_id: req.body.user_id
    }

    if (isNaN(data.quest_id) || isNaN(data.user_id)) {
        res.status(400).send ("Error: IDs must be a number");
        return;
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error loading :", error);
            return res.status(500).json(error);
        } else {
            if (results.length === 0) {
                return res.status(404).json({error: "Quest or User not found"});
            }
        }
        res.locals.xp_reward = results[0].xp_reward;
        res.locals.username = results[0].username;
        next();

    }
    model.GetXpReward(data, callback)
}




// Show that you've started the quest
module.exports.StartQuest = (req, res, next) =>
{
    const data = {
        id: req.params.id,
        user_id: req.body.user_id
    }

    
    const callbackRemoveComplete = (error, results, fields) => {
        if (error) {
            console.error("Error Removing old complete", error)
        }
    }


    const callbackStart = (error2, results2, fields) => {
        if (error2) {
            console.error("Error StartQuest:", error2);
            if (error2.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error2: "Quest already started" });
            } else {
                return res.status(500).json(error2);
            }
            
        } 
            res.status(201).json({
                id: results2.insertId,
                user_id: data.user_id,
                quest_id: Number(data.id),
                status: "User " + res.locals.username + " has started his quest",
                started_at: new Date().toISOString()
            })
    }
    model.removeCompletion(data, callbackRemoveComplete)
    model.StartingQuest(data, callbackStart);
}



// Show that youve completed the quest
module.exports.CompleteQuest = (req, res, next) =>
{
    const data = {
        id: Number(req.params.id),
        user_id: Number(req.body.user_id)
    };
    if (isNaN(data.id) || isNaN(data.user_id)) {
        return res.status(400).send("Error: invalid IDs");
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewuser:", error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: "Quest Completed" });
            } else {
                return res.status(500).json(error);
            }
                
        }
        res.status(201).json({
            message: "Quest completed",
            user_id: data.user_id,
            username: res.locals.username,
            quest_id: data.id,
            rewarded_xp: res.locals.xp_reward,
            total_xp: results.xp,
            rank: results.rank,
            xp_to_next: results.nextXp,
            completed_at: new Date().toISOString()
        });
}
    model.finishQuest(data, callback);
}