const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const Donation = require('../models/Donation');
const User = require('../models/User');
const AdminSettings = require('../models/AdminSettings');
const { sendDonationConfirmation, sendDonationConfirmationWithPDF } = require('../services/emailService');
const { generateReceiptPDF } = require('../services/pdfService');

// ============================================
// USER ROUTES
// ============================================

// @desc    Create donation (sets status to 'pending' by default)
// @route   POST /api/donations
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { amount, paymentMethod, name, email, phone, message } = req.body;

    const donation = await Donation.create({
      userId: req.user.id,
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone || '',
      amount: amount || 0,
      paymentMethod: paymentMethod || 'cash',
      message: message || '',
      status: 'pending', // Always start as pending
    });

    // Send confirmation email (but not receipt yet, since it's pending)
    try {
      await sendDonationConfirmation(donation, user);
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.status(201).json({
      success: true,
      data: donation,
      message: 'Donation recorded successfully. Waiting for admin approval.'
    });
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
    res.json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    console.error('Get my donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({ userId: req.user.id });
    const totalAmount = await Donation.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalDonations,
        totalAmount: totalAmount[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get donation stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// @desc    Get all donations (admin only)
// @route   GET /api/donations
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status, limit = 100, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const donations = await Donation.find(query)
      .sort({ date: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    const total = await Donation.countDocuments(query);
    
    res.json({
      success: true,
      data: donations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update donation status (admin only)
// @route   PUT /api/donations/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    // If status changed to completed, send receipt and update count
    if (status === 'completed') {
      const user = await User.findById(donation.userId);
      if (user) {
        // Update donation count in settings
        const settings = await AdminSettings.getSettings();
        if (settings.donate) {
          settings.donate.baseCount = (settings.donate.baseCount || 0) + 1;
          await settings.save();
        }
        
        // Send receipt with PDF
        try {
          const pdfBuffer = await generateReceiptPDF(donation, user);
          await sendDonationConfirmationWithPDF(donation, user, pdfBuffer);
        } catch (emailError) {
          console.error('Email error:', emailError);
        }
      }
    }
    
    res.json({
      success: true,
      data: donation,
      message: `Donation status updated to ${status}`
    });
  } catch (error) {
    console.error('Update donation status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete donation (admin only)
// @route   DELETE /api/donations/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// EMAIL ROUTES
// ============================================

// @desc    Send donation confirmation email (admin only)
// @route   POST /api/donations/send-email
// @access  Private/Admin
router.post('/send-email', protect, admin, async (req, res) => {
  try {
    const { donationId } = req.body;
    
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    const user = await User.findById(donation.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await sendDonationConfirmation(donation, user);
    
    res.json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// @desc    Send donation confirmation email with PDF receipt (admin only)
// @route   POST /api/donations/send-email-with-pdf
// @access  Private/Admin
router.post('/send-email-with-pdf', protect, admin, async (req, res) => {
  try {
    const { donationId } = req.body;
    
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    const user = await User.findById(donation.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const pdfBuffer = await generateReceiptPDF(donation, user);
    await sendDonationConfirmationWithPDF(donation, user, pdfBuffer);
    
    res.json({
      success: true,
      message: 'Email with PDF sent successfully'
    });
  } catch (error) {
    console.error('Send email with PDF error:', error);
    res.status(500).json({ message: 'Failed to send email with PDF' });
  }
});

// @desc    Send donation confirmation email with PDF to user (user can request)
// @route   POST /api/donations/:id/email-receipt
// @access  Private
router.post('/:id/email-receipt', protect, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    if (donation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (donation.status !== 'completed') {
      return res.status(400).json({ message: 'Receipt only available for completed donations' });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const pdfBuffer = await generateReceiptPDF(donation, user);
    await sendDonationConfirmationWithPDF(donation, user, pdfBuffer);
    
    res.json({
      success: true,
      message: 'Receipt sent to your email'
    });
  } catch (error) {
    console.error('Send receipt error:', error);
    res.status(500).json({ message: 'Failed to send receipt' });
  }
});

// ============================================
// PUBLIC ROUTES (for admin settings)
// ============================================

// @desc    Get donation settings (public)
// @route   GET /api/donations/settings
// @access  Public
router.get('/settings', async (req, res) => {
  try {
    const settings = await AdminSettings.getSettings();
    res.json({
      success: true,
      data: {
        qrPhoto: settings.donate?.qrPhoto || null,
        baseCount: settings.donate?.baseCount || 0,
        bankNumber: settings.donate?.bankNumber || '',
        bankName: settings.donate?.bankName || '',
        accountHolder: settings.donate?.accountHolder || ''
      }
    });
  } catch (error) {
    console.error('Get donation settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;