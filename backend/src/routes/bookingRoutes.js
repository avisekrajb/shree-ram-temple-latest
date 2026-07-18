const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendBookingConfirmation } = require('../services/emailService');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, phone, date, type } = req.body;
    const user = await User.findById(req.user.id);

    const booking = await Booking.create({
      userId: req.user.id,
      name: name || user.name,
      phone: phone || user.phone,
      email: user.email,
      date,
      type,
      status: 'pending',
    });

    // Send confirmation email
    try {
      await sendBookingConfirmation(booking, user);
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;