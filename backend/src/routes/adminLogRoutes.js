const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

// In-memory storage for admin logs (can be replaced with database)
let adminActivityLogs = [];

// @desc    Get admin activity logs
// @route   GET /api/admin/activity
// @access  Private/Admin
router.get('/', protect, admin, (req, res) => {
  try {
    // Return logs sorted by timestamp (newest first)
    const logs = adminActivityLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(logs);
  } catch (error) {
    console.error('Get admin activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Add admin activity log
// @route   POST /api/admin/activity/log
// @access  Private/Admin
router.post('/log', protect, admin, (req, res) => {
  try {
    const { action, details } = req.body;
    const log = {
      action: action || 'Admin action',
      details: details || {},
      timestamp: new Date().toISOString(),
      user: { 
        name: req.user.name || 'Admin', 
        email: req.user.email || 'admin@temple.com',
        id: req.user.id
      },
      adminId: req.user.id,
    };
    
    adminActivityLogs.push(log);
    // Keep only last 1000 logs
    if (adminActivityLogs.length > 1000) {
      adminActivityLogs = adminActivityLogs.slice(-1000);
    }
    
    res.json({ success: true, data: log });
  } catch (error) {
    console.error('Add admin log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Clear admin activity logs
// @route   DELETE /api/admin/activity
// @access  Private/Admin
router.delete('/', protect, admin, (req, res) => {
  try {
    adminActivityLogs = [];
    res.json({ success: true, message: 'All logs cleared' });
  } catch (error) {
    console.error('Clear logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get admin activity stats
// @route   GET /api/admin/activity/stats
// @access  Private/Admin
router.get('/stats', protect, admin, (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    res.json({
      success: true,
      data: {
        total: adminActivityLogs.length,
        today: adminActivityLogs.filter(l => new Date(l.timestamp) >= today).length,
        thisWeek: adminActivityLogs.filter(l => new Date(l.timestamp) >= weekAgo).length,
        thisMonth: adminActivityLogs.filter(l => new Date(l.timestamp) >= monthAgo).length,
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;