const express = require('express');
const router = express.Router();
const controller = require('../controllers/GameUsersController');


// Create a new user
router.post("/", controller.CreateGameUsers)

// Retrieve all gameuser
router.get("/", controller.GetAllGameUsers)

// Retrieve specific gameuser by ID
router.get("/:id", controller.GetGameUsersById)

// Update specific gameuser by ID
router.put("/:id", controller.UpdateGameUsers)

// Create a PVP to fight players
router.post("/pvp", controller.ChallengePlayers)



module.exports = router;