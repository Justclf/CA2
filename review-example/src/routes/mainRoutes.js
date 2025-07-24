const express = require('express');
const router = express.Router();

const reviewRoutes = require('./reviewRoutes');

router.use("/review", reviewRoutes);

module.exports = router;