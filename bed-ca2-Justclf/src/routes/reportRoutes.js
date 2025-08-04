const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// Get available vulnerabilities (excluding ones user has already reported)
router.get("/available", jwtMiddleware.verifyToken, controller.getAvailableVulnerabilities);

// Submit a new report
router.post("/", jwtMiddleware.verifyToken, controller.submitReport);

// Get user's reports
router.get("/user", jwtMiddleware.verifyToken, controller.getUserReports);

module.exports = router;