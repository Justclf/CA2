const model = require("../models/GameUsersModel.js");

// Create a new gameuser
module.exports.CreateGameUsers = (req, res, next) =>
{
    if(req.body.username == undefined)
    {
        res.status(400).send("Error: Username is undefined");
        return;
    }
    if(req.body.user_id == undefined) {
        res.status(400).send("Error: user_id is undefined");
        return;
    }
 
    const data = {
        user_id: req.body.user_id,
        username: req.body.username
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error CreateGameUsers:", error);
            if (error.code === 'ER_DUP_ENTRY') { //Ensure no duplicates
                return res.status(409).json({ error: "Username already exists" });
            }
                return res.status(500).json(error);
        }
            res.status(201).json({
                id: Number(results.insertId),
                username: data.username,
                xp: 0,
                Rank: "E-Rank Hunter"
            });
    }

    model.insertSingle(data, callback);
}


// Retrieve all gameuser
module.exports.GetAllGameUsers = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error GetAllGameUsers:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}

// Retrieve specific gameuser by ID
module.exports.GetGameUsersById = (req, res, next) =>
{
    // const data = {
    //     id: req.params.id
    // }
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



// Update specific gameuser details
module.exports.UpdateGameUsers = (req, res, next) =>
{
    if(req.body.username == undefined)
    {
        res.status(400).send("Error: Username is undefined");
        return;
    }

    const data = {
        id: Number(req.params.id), 
        username: req.body.username,
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error UpdateGameUsers:", error);
            if (error.code === 'ER_DUP_ENTRY') { 
                return res.status(409).json({ error: "Username already exists" });
            } else {
                return res.status(500).json(error);
            }
        }

            if (results.affectedRows == 0) {
                res.status(404).json({message: "User not found"});
            }
            res.status(201).json({
                id: data.id,
                username: data.username,
            });
        }

    model.updateById(data, callback);
}


// Fight other player :D
module.exports.ChallengePlayers = (req, res, next) =>
{
    const data = {
        challenger_id: Number(req.body.challenger_id),
        opponent_id: Number(req.body.opponent_id)
    };

    if (isNaN(data.challenger_id) || isNaN(data.opponent_id))
    {
        res.status(400).send("Error: invalid player IDs");
        return;
    }

    const callback = (error, result) =>
    {
       if (error) {
            console.error("Error createNewuser:", error);
            if (error.code === 'USER_NOT_FOUND') {
                return res.status(404).json({ error: "One of the player is not found" });
            } else {
                return res.status(500).json(error);
            }
                
        }
        res.status(201).json({
            challenger_id: data.challenger_id,
            opponent_id: data.opponent_id,
            winner_id: result.winner_id,
            winner_rank: result.winner_rank,
            loser_id: result.loser_id,
            loser_rank: result.loser_rank,
            message:  "Player " + result.winner_id + " wins!"
        });
    };

    model.challengePlayers(data, callback);
};
    

        

