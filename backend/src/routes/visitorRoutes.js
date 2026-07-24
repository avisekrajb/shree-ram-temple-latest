const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  trackVisitor,
  getVisitorStats,
  updateTimeSpent,
  getVisitorDetails,
} = require('../controllers/visitorController');

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// @desc    Track visitor
// @route   POST /api/visitors/track
// @access  Public
router.post('/track', trackVisitor);

// @desc    Update time spent on page
// @route   POST /api/visitors/time
// @access  Public
router.post('/time', updateTimeSpent);

// ============================================
// ADMIN ROUTES (Authentication + Admin required)
// ============================================

// @desc    Get visitor stats
// @route   GET /api/visitors/stats
// @access  Private/Admin
router.get('/stats', protect, admin, getVisitorStats);

// @desc    Get visitor details by ID
// @route   GET /api/visitors/:id
// @access  Private/Admin
router.get('/:id', protect, admin, getVisitorDetails);

module.exports = router;
