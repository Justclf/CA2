const express = require('express');
const router = express.Router();
const controller = require('../controllers/questsController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get("/", controller.GetAllQuest);

router.post("/", jwtMiddleware.verifyToken, controller.CreateQuest);
router.post("/:questId/accept", jwtMiddleware.verifyToken, controller.AcceptQuest);
router.delete("/:id", jwtMiddleware.verifyToken, controller.DeleteQuest);

module.exports = router;