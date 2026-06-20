const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth.middleware')
const { searchApp } = require('../controllers/search.controller')

router.use(verifyToken)

router.get('/', searchApp)

module.exports = router