const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// show all vuln
router.get("/available", jwtMiddleware.verifyToken, controller.getAvailableVulnerabilities);

// submit new report
router.post("/", jwtMiddleware.verifyToken, controller.submitReport);

// show users report
router.get("/user", jwtMiddleware.verifyToken, controller.getUserReports);

module.exports = router;