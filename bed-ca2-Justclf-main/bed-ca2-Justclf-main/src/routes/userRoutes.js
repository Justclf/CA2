const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

// Create new user
router.post("/", controller.CreateNewUser);

// Retrieve all user 
router.get("/", controller.ReadAllUser)

// Retrieve the specific user by ID
router.get("/:id", controller.ReadUserById)

// Update the specific user by ID
router.put("/:id", controller.UpdateUserById)


module.exports = router;