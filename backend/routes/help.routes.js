const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth.middleware')
const { getHelpCenter } = require('../controllers/help.controller')

router.use(verifyToken)

router.get('/', getHelpCenter)

module.exports = router