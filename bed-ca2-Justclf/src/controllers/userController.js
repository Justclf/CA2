const model = require("../models/userModel.js");
const gameUserModel = require("../models/GameUsersModel.js")
const questsModel = require("../models/questsModel.js")
const bcrypt = require("bcrypt");

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

        // Add these two lines** so comparePassword has the data it needs
        res.locals.hash   = user.password; // .hash because it is the name we chose at bcryptMiddleware.js
        res.locals.userId = user.id;
        console.log("res.locals.userId", res.locals.userId)
        next();

    }
    model.selectByUsername(data, callback)
};

// Register the user
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
        res.locals.userId = results.insertId;
        res.locals.username = data.username;
        res.locals.message =`User ${data.username} created succesfuly`;

        console.log("User registered with ID:", res.locals.userId);
        console.log("Username stored:", res.locals.username);
        next(); // need next to work properly
        // else res.status(200).json({message: `User ${data.username} created succesfuly`});
    }
    model.registering(data, callback);
}

// Create gameuser for user
module.exports.createGameUser = (req, res, next) => {
    console.log("Creating GameUser for:", res.locals.username);
    console.log("User ID:", res.locals.userId);
    
    const data = {
        user_id: res.locals.userId,
        username: res.locals.username
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error creating gameuser:", error);
        } else {
            console.log("Gameuser created with ID:", results.insertId);
        }
        next();
    }
    gameUserModel.insertSingle(data, callback);
}



// Check if the username or email existed
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




// Create a single quest for every new user to start off
module.exports.createDefaultQuest = (req, res, next) => {
    console.log("Creating default quest for new user:", res.locals.username);

    const data = {
        title: "Starting quest",
        description: `Welcome to the game ${res.locals.username}! Complete this welcome quest and earn a starting XP of 100`,
        xp_reward: 100,
        recommended_rank: "Beginner",
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error creating default quest:", error);
        } else {
            console.log("Default quest created");
        }
        next();
    }
    questsModel.insertQuest(data, callback)
}

