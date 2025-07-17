const express = require('express');
const router = express.Router();


const userRoutes = require("./userRoutes");
const reportRoutes = require("./reportRoutes");
const vulnerabilityRoutes = require("./vulnerabilityRoutes");



router.use("/users", userRoutes);
router.use("/vulnerabilities", vulnerabilityRoutes);
router.use("/reports", reportRoutes);

const GameUsersRoutes = require("./GameUsersRoutes")
const QuestsRoutes = require("./QuestsRoutes")
router.use("/gameusers", GameUsersRoutes)
router.use("/quests", QuestsRoutes)


module.exports = router;