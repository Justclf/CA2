const express = require('express');
const router = express.Router();
const controller = require('../controllers/questsController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// Public route - Get all quests (no auth needed for viewing)
router.get("/", controller.GetAllQuest);

// Protected routes - require authentication
router.post("/", jwtMiddleware.verifyToken, controller.CreateQuest);
router.post("/:questId/accept", jwtMiddleware.verifyToken, controller.AcceptQuest);
router.post("/:id/complete", jwtMiddleware.verifyToken, controller.CompleteQuest);
router.delete("/:id", jwtMiddleware.verifyToken, controller.DeleteQuest);

module.exports = router;