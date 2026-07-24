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

// Public routes
router.post('/track', trackVisitor);
router.post('/time', updateTimeSpent);

// Admin routes
router.get('/stats', protect, admin, getVisitorStats);
router.get('/:id', protect, admin, getVisitorDetails);

module.exports = router;