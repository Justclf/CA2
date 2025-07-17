const model = require("../models/userModel.js");


// Question 1
// Create new user
module.exports.CreateNewUser = (req, res, next) =>
{
    if(req.body.username == undefined)
    {
        res.status(400).send("Error: Username is undefined");
        return;
    }
 
    
    const data = {
        username: req.body.username,
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewuser:", error);
            if (error.code === 'ER_DUP_ENTRY') { //Ensure no duplicates
                return res.status(409).json({ error: "Username already exists" });
            }
                return res.status(500).json(error);
        }
            res.status(201).json({
                id: Number(results.insertId),
                username: data.username,
                reputation: 0
            });
    }

    model.insertSingle(data, callback);
}


// Question 2
// Retrieve the list of all user
module.exports.ReadAllUser = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllPlayer:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}


// Question 3
// Getting the user information by ID
module.exports.ReadUserById = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error ReadUserById:", error);
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



// Question 4
// Updating the user by ID
module.exports.UpdateUserById = (req, res, next) =>
{
    if(req.body.username == undefined || req.body.reputation == undefined)
    {
        res.status(400).json({
            message: "Error: Username or Reputation is undefined"
        });
        return;
    }

    const data = {
        id: req.params.id, 
        username: req.body.username,
        reputation: req.body.reputation
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error UpdateUserById:", error);
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
                id: Number(data.id),
                username: data.username,
                reputation: data.reputation
            });
        }

    model.updateById(data, callback);
}



