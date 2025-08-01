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
            if (error.code === 'ER_DUP_ENTRY') { // Ensure no duplicates
                return res.status(409).json({ error: "Username already exists" });
            }
            if (error.code === 'ER_NO_REFERENCED_ROW_2') { // Foreign key constraint
                return res.status(404).json({ error: "User ID not found" });
}
                return res.status(500).json(error);
        }
            res.status(201).json({
                id: Number(results.insertId),
                user_id: data.user_id,
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
            res.status(200).json({
                id: data.id,
                username: data.username,
            });
        }

    model.updateById(data, callback);
}



    

        

