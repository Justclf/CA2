const model = require("../models/pokemonModel.js");

module.exports.createNewPokemon = (req, res, next) =>
{
    if(req.body.username == undefined)
    {
        res.status(400).send("Error: Username is undefined");
        return;
    }
    else if(req.body.email == undefined)
    {
        res.status(400).send("Error: Email is undefined");
        return;
    }
    else if(req.body.password == undefined)
    {
        res.status(400).send("Error: Password is undefined");
        return;
    }

    const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewuser:", error);
            res.status(500).json(error);
        } else {
            // res.locals.userId = results.insertId;
            // next ()
            res.status(201).json(results);
        }
    }

    model.insertSingle(data, callback);
}


module.exports.readNewPokemonById = (req, res, next) =>
{
    const data = {
        id: res.locals.userId
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readNewUserById:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
            else res.status(201).json({
                "message": "User created successfully",
                "user": results[0]
            });      
        }
    }

    model.selectById(data, callback);
}


module.exports.readAllPokemon = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllUser:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}
