const express = require('express')
const router = express.Router()
const {
  getOffers,
  createOffer,
  updateOffer,
  getOfferHistory,
  updateOfferStatus,
  getOfferById
} = require('../controllers/offer.controller')
const verifyToken = require('../middleware/auth.middleware')
const { downloadPDF } = require('../controllers/pdf.controller')

router.get('/:id/pdf', verifyToken, downloadPDF)
router.get('/:id/history', verifyToken, getOfferHistory)
router.patch('/:id/status', verifyToken, updateOfferStatus)

router.get('/', verifyToken, getOffers)
router.get('/:id', verifyToken, getOfferById)
router.post('/', verifyToken, createOffer)
router.put('/:id', verifyToken, updateOffer)

module.exports = router