const express = require('express');
const router = express.Router();

const jwtMiddleware = require('../middlewares/jwtMiddleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');
const userController = require('../controllers/userController')
const QuestsRoutes = require('./QuestsRoutes')


router.use("/quests", QuestsRoutes)




router.post("/login", userController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.post("/register", userController.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, userController.register, userController.createGameUser, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.post("/jwt/generate", jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.get("/jwt/verify", jwtMiddleware.verifyToken);
router.post("/bcrypt/compare", bcryptMiddleware.comparePassword);
router.post("/bcrypt/hash", bcryptMiddleware.hashPassword);
module.exports = router;