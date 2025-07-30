const express = require('express');
const router = express.Router();
const controller = require('../controllers/pvpController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// get the users
router.get("/players", jwtMiddleware.verifyToken, controller.getAvailablePlayers);

// challenge users
router.post("/challenge", jwtMiddleware.verifyToken, controller.challengePlayer);

// get the users stats
router.get("/stats", jwtMiddleware.verifyToken, controller.getPlayerStats);

module.exports = router;