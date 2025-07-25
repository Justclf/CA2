const express = require('express');
const router = express.Router();


const exampleController = require('../controllers/exampleController.js');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');
const userController = require('../controllers/userController')

const pokemonRoutes = require("./pokemonRoutes");
const playerRoutes = require("./playerRoutes") // First step
const pokedexRoutes = require("./pokedexRoutes");
// const userRoutes = require("./userRoutes");


router.use("/pokemon", pokemonRoutes); // This means /api/pokemon. Same for everything in mainroutes
router.use("/player", playerRoutes) // First step
router.use("/pokedex", pokedexRoutes)

// router.use("/pokedex", pokedexRoutes);
// router.use("/user", userRoutes);
// router.use("/pokedex", pokedexRoutes);
// router.use("/pokemon", pokemonRoutes);





router.post("/login", userController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.post("/register", userController.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, userController.register, jwtMiddleware.generateToken, jwtMiddleware.sendToken);

router.post("/jwt/generate", exampleController.preTokenGenerate, jwtMiddleware.generateToken, exampleController.beforeSendToken, jwtMiddleware.sendToken);
router.get("/jwt/verify", jwtMiddleware.verifyToken, exampleController.showTokenVerified);
router.post("/bcrypt/compare", exampleController.preCompare, bcryptMiddleware.comparePassword, exampleController.showCompareSuccess);
router.post("/bcrypt/hash", bcryptMiddleware.hashPassword, exampleController.showHashing);
module.exports = router;