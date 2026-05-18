const express = require('express')
const router = express.Router()
const { getDashboardStats, getRecentActivity, getOffersChart } = require('../controllers/dashboard.controller')
const verifyToken = require("../middleware/auth.middleware");

router.use(verifyToken);

router.get('/stats', getDashboardStats)
router.get('/activity', getRecentActivity)
router.get('/chart', getOffersChart)

module.exports = router