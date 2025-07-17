const express = require('express');
const router = express.Router();
const controller = require('../controllers/questsController');


// Create a quest
router.post("/", controller.CreateQuests)

// Retrieve all quests
router.get("/", controller.GetAllQuest)

// Retrieve specific quest by ID
router.get("/:id", controller.GetQuestsById)

// Update specific quest by ID
router.put("/:id", controller.UpdateQuest)

// Load the xp for the starting quest. Then start the quest
router.post("/:id/start", controller.LoadXp, controller.StartQuest)

// Load the xp for completing quests. Then complete the quest
router.post("/:id/complete", controller.LoadXp, controller.CompleteQuest)


module.exports = router;