const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Donation = require('../models/Donation');
const User = require('../models/User');
const { sendDonationConfirmation } = require('../services/emailService');

// @desc    Create donation
// @route   POST /api/donations
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const donation = await Donation.create({
      userId: req.user.id,
      name: user.name,
      email: user.email,
      amount: req.body.amount || 0,
    });

    // Send confirmation email
    try {
      await sendDonationConfirmation(donation, user);
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.status(201).json(donation);
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user donations
// @route   GET /api/donations/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(donations);
  } catch (error) {
    console.error('Get my donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;