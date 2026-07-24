const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  initiateEsewaPayment,
  verifyEsewaPayment,
  getDonationStatus,
} = require('../controllers/paymentController');

// Initiate eSewa payment
router.post('/esewa/initiate', protect, initiateEsewaPayment);

// Verify eSewa payment
router.post('/esewa/verify', protect, verifyEsewaPayment);

// Get donation status
router.get('/status/:donationId', protect, getDonationStatus);

module.exports = router;