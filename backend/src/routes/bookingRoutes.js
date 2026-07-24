const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');
const AdminSettings = require('../models/AdminSettings');
const { sendBookingConfirmation } = require('../services/emailService');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Check if booking is available
    const settings = await AdminSettings.getSettings();
    if (settings.bookingAvailable === false) {
      return res.status(403).json({ 
        message: settings.availabilityMessage || 'Bookings are currently unavailable' 
      });
    }

    const { name, phone, date, type, description } = req.body;
    const user = await User.findById(req.user.id);

    // Validate date - cannot book past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return res.status(400).json({ 
        message: 'Cannot book for past dates. Please select a future date.' 
      });
    }

    // Check date limit
    if (settings.dateLimits && settings.dateLimits[date] !== undefined) {
      const limit = settings.dateLimits[date];
      // If limit is 0 or less, prevent booking
      if (limit <= 0) {
        return res.status(400).json({ 
          message: `Booking limit reached for ${date}. No slots available.` 
        });
      }
      
      const bookingsCount = await Booking.countDocuments({ date });
      if (bookingsCount >= limit) {
        return res.status(400).json({ 
          message: `Booking limit reached for ${date}. Maximum ${limit} bookings allowed.` 
        });
      }
    }

    const booking = await Booking.create({
      userId: req.user.id,
      name: name || user.name,
      phone: phone || user.phone,
      email: user.email,
      date,
      type,
      description: description || '',
      status: 'pending',
    });

    // Send confirmation email
    try {
      await sendBookingConfirmation(booking, user);
    } catch (emailError) {
      console.error('Email error:', emailError);
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