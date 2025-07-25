//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const express = require('express');
const router = express.Router();

//////////////////////////////////////////////////////
// CREATE ROUTER
//////////////////////////////////////////////////////
const controller = require('../controllers/pokedexController.js');


//////////////////////////////////////////////////////
// DEFINE ROUTES
//////////////////////////////////////////////////////
router.get('/', controller.readAllUser); // Sec step

// router.post('/create', controller.checkUsernameOrEmailExist, controller.register)


//////////////////////////////////////////////////////
// EXPORT ROUTER
//////////////////////////////////////////////////////
module.exports = router;