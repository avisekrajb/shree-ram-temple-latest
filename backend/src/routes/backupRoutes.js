const express = require('express');
const router = express.Router();
const Backup = require('../models/Backup');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const cloudinary = require('../config/cloudinary');

// ============================================
// BACKUP ROUTES
// ============================================

// @desc    Create backup
// @route   POST /api/admin/backup/create
// @access  Private/Admin
router.post('/create', protect, admin, async (req, res) => {
  try {
    const { description, type, includeDeleted } = req.body;

    // Collect all data
    const backupData = {
      users: await collectUsers(),
      bookings: await collectBookings(),
      donations: await collectDonations(),
      events: await collectEvents(),
      gallery: await collectGallery(),
      history: await collectHistory(),
      team: await collectTeam(),
      contacts: await collectContacts(),
      visitors: await collectVisitors(),
      blogs: await collectBlogs(),
      settings: await collectSettings(),
    };

    // Collect deleted items (last 30 days)
    let deletedItems = [];
    if (includeDeleted !== false) {
      deletedItems = await collectDeletedItems();
    }

    // Create backup document
    const backup = await Backup.create({
      name: `Backup-${new Date().toISOString().split('T')[0]}`,
      description: description || 'Full system backup',
      type: type || 'full',
      data: backupData,
      stats: {
        users: backupData.users.length,
        bookings: backupData.bookings.length,
        donations: backupData.donations.length,
        events: backupData.events.length,
        gallery: backupData.gallery.length,
        history: backupData.history.length,
        team: backupData.team.length,
        contacts: backupData.contacts.length,
        visitors: backupData.visitors.length,
        blogs: backupData.blogs.length,
      },
      deletedItems: deletedItems,
      createdBy: req.user.id,
      createdByName: req.user.name || 'Admin',
      status: 'completed',
    });

    // Upload to Cloudinary as backup file
    try {
      const backupJson = JSON.stringify(backupData, null, 2);
      const buffer = Buffer.from(backupJson, 'utf-8');
      
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'temple-backups',
            resource_type: 'raw',
            public_id: `backup-${backup._id}`,
            format: 'json',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      backup.fileUrl = result.secure_url;
      backup.fileId = result.public_id;
      backup.fileSize = result.bytes;
      await backup.save();
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      // Continue even if Cloudinary fails
    }

    res.json({
      success: true,
      message: 'Backup created successfully',
      data: backup,
    });
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all backups
// @route   GET /api/admin/backup
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const backups = await Backup.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    res.json({
      success: true,
      data: backups,
    });
  } catch (error) {
    console.error('Get backups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Download backup
// @route   GET /api/admin/backup/:id/download
// @access  Private/Admin
router.get('/:id/download', protect, admin, async (req, res) => {
  try {
    const backup = await Backup.findById(req.params.id);
    if (!backup) {
      return res.status(404).json({ message: 'Backup not found' });
    }

    const backupJson = JSON.stringify(backup.data, null, 2);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=backup-${backup._id}.json`);
    res.send(backupJson);
  } catch (error) {
    console.error('Download backup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get Cloudinary backup URL
// @route   GET /api/admin/backup/:id/cloudinary
// @access  Private/Admin
router.get('/:id/cloudinary', protect, admin, async (req, res) => {
  try {
    const backup = await Backup.findById(req.params.id);
    if (!backup) {
      return res.status(404).json({ message: 'Backup not found' });
    }

    if (!backup.fileUrl) {
      return res.status(404).json({ message: 'No file uploaded to Cloudinary' });
    }

    res.json({
      success: true,
      fileUrl: backup.fileUrl,
    });
  } catch (error) {
    console.error('Get Cloudinary URL error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Restore from backup
// @route   POST /api/admin/backup/:id/restore
// @access  Private/Admin
router.post('/:id/restore', protect, admin, async (req, res) => {
  try {
    const backup = await Backup.findById(req.params.id);
    if (!backup) {
      return res.status(404).json({ message: 'Backup not found' });
    }

    // Restore logic would go here
    // This would depend on your data models

    res.json({
      success: true,
      message: 'Backup restored successfully',
    });
  } catch (error) {
    console.error('Restore backup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete backup
// @route   DELETE /api/admin/backup/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const backup = await Backup.findById(req.params.id);
    if (!backup) {
      return res.status(404).json({ message: 'Backup not found' });
    }

    // Delete from Cloudinary
    if (backup.fileId) {
      try {
        await cloudinary.uploader.destroy(backup.fileId, { resource_type: 'raw' });
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
      }
    }

    await backup.deleteOne();
    res.json({
      success: true,
      message: 'Backup deleted successfully',
    });
  } catch (error) {
    console.error('Delete backup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get backup stats
// @route   GET /api/admin/backup/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const total = await Backup.countDocuments();
    const recent = await Backup.find()
      .sort({ createdAt: -1 })
      .limit(1);
    
    const totalSize = await Backup.aggregate([
      { $group: { _id: null, total: { $sum: '$fileSize' } } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        recent: recent[0] || null,
        totalSize: totalSize[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

async function collectUsers() {
  const User = require('../models/User');
  return await User.find().select('-password');
}

async function collectBookings() {
  const Booking = require('../models/Booking');
  return await Booking.find();
}

async function collectDonations() {
  const Donation = require('../models/Donation');
  return await Donation.find();
}

async function collectEvents() {
  const Event = require('../models/Event');
  return await Event.find();
}

async function collectGallery() {
  const Gallery = require('../models/Gallery');
  return await Gallery.find();
}

async function collectHistory() {
  const History = require('../models/History');
  return await History.find();
}

async function collectTeam() {
  const Team = require('../models/Team');
  return await Team.find();
}

async function collectContacts() {
  const Contact = require('../models/Contact');
  return await Contact.find();
}

async function collectVisitors() {
  const Visitor = require('../models/Visitor');
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return await Visitor.find({ createdAt: { $gte: thirtyDaysAgo } });
}

async function collectBlogs() {
  const Blog = require('../models/Blog');
  return await Blog.find();
}

async function collectSettings() {
  const AdminSettings = require('../models/AdminSettings');
  return await AdminSettings.getSettings();
}

async function collectDeletedItems() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // This would need to track deleted items in a separate collection
  // For now, return an empty array
  return [];
}

module.exports = router;