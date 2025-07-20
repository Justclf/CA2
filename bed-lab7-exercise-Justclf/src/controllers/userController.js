//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const model = require("../models/userModel.js");
const bcrypt = require("bcrypt");

//////////////////////////////////////////////////////
// GET ALL PLAYERS BY USER
//////////////////////////////////////////////////////
module.exports.readAllUser = (req, res, next) =>
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

//////////////////////////////////////////////////////
// CONTROLLER FOR LOGIN
//////////////////////////////////////////////////////
module.exports.login = (req, res, next) =>
{
    if (!req.body.username || !req.body.password) {
        return res
          .status(400)
          .json({ message: "Username or password is undefined" });
    }

    const data = {
        username: req.body.username,
        password: req.body.password
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error selectByUsername:", error);
            return res.status(500).json(error);
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];

        // ← **ADD these two lines** so comparePassword has the data it needs
        res.locals.hash   = user.password; // .hash because it is the name we chose at bcryptMiddleware.js
        res.locals.userId = user.id;
        console.log("res.locals.hash ",res.locals.hash )
        console.log("res.locals.userId", res.locals.userId)
        next();

    }
    model.selectByUsername(data, callback)
};



//////////////////////////////////////////////////////
// CONTROLLER FOR REGISTER
//////////////////////////////////////////////////////
module.exports.register = (req, res, next) =>
{
    const data = {
        username: req.body.username,
        email: req.body.email,
        password: res.locals.hash
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error registering:", error);
            res.status(500).json(error);
        }
        else res.locals.message =`User ${data.username} created succesfuly`
        next(); // need next to work properly
        // else res.status(200).json({message: `User ${data.username} created succesfuly`});
    }
    model.registering(data, callback);
}

//////////////////////////////////////////////////////
// MIDDLEWARE FOR CHECK IF USERNAME OR EMAIL EXISTS
//////////////////////////////////////////////////////
module.exports.checkUsernameOrEmailExist = (req,res,next) => {
    const data = {
        username: req.body.username,
        email: req.body.email
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUserAndPlayer:", error);
            return res.status(500).json(error);
        }
        if (results.length > 0) {
            return res.status(409).json({ message: "Username or Email already exists." });
        }
        // ownership confirmed
        next();
    };

    model.selectUsernameOrEmail(data, callback);
};

//////////////////////////////////////////////////////
// MIDDLWARE FOR CHECK IF PLAYER BELONGS TO USER
//////////////////////////////////////////////////////
