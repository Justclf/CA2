const express = require('express');
const router = express.Router();
const controller = require('../controllers/questsController');


// Retrieve all quests
router.get("/", controller.GetAllQuest)

module.exports = router;