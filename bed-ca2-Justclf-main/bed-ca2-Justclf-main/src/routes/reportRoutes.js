const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');

// Verify if the UserId exists, followed by vulnID. Then create report record and link users and vulnerability
router.post("/", controller.CheckUserId, controller.CheckVulnerabilityId, controller.CreateNewReport, controller.UpdateUserReputation) 


// Check if the report exists first, then check if the user_id exists, lastly to add them both together
router.put("/:id", controller.CheckReport, controller.CheckCloser, controller.FinishReport)


module.exports = router;