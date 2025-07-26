const express = require('express');
const router = express.Router();
const controller = require('../controllers/questsController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get("/current", jwtMiddleware.verifyToken, controller.GetCurrentQuests);

router.post("/:id/complete", jwtMiddleware.verifyToken, controller.CompleteQuest);


module.exports = router;