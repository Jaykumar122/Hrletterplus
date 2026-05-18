const express = require('express')
const router = express.Router()
const {
  getCandidates,
  createCandidate,
  deleteCandidate,
  updateCandidate
} = require('../controllers/candidate.controller')
const verifyToken = require('../middleware/auth.middleware')

router.get('/', verifyToken, getCandidates)
router.post('/', verifyToken, createCandidate)
router.put('/:id', verifyToken, updateCandidate)
router.delete('/:id', verifyToken, deleteCandidate)

module.exports = router