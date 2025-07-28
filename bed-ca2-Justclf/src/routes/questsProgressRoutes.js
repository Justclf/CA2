const express = require('express');
const router = express.Router();
const controller = require('../controllers/questsProgressControllers');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// show the quest that the user has accepted
router.get("/current", jwtMiddleware.verifyToken, controller.GetCurrentQuests);

router.post("/:questId/complete", jwtMiddleware.verifyToken, controller.CompleteQuest);


module.exports = router;