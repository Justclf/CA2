const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// submit a vuln
router.post("/", jwtMiddleware.verifyToken, controller.submitReport);

// show the user reports log
router.get("/user", jwtMiddleware.verifyToken, controller.getUserReports);

module.exports = router;