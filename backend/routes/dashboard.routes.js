const express = require('express')
const router = express.Router()
const { getDashboardStats, getRecentActivity, getOffersChart } = require('../controllers/dashboard.controller')
const verifyToken = require('../middleware/auth.middleware')

router.get('/stats', verifyToken, getDashboardStats)
router.get('/activity', verifyToken, getRecentActivity)
router.get('/chart', verifyToken, getOffersChart)

module.exports = router