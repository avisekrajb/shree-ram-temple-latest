const mongoose = require('mongoose');
const AdminSettings = require('../models/AdminSettings');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Donation = require('../models/Donation');
const History = require('../models/History');
const Team = require('../models/Team');
const Gallery = require('../models/Gallery');
const Event = require('../models/Event');
const Contact = require('../models/Contact');
const cloudinary = require('../config/cloudinary');
const { sendTeamWelcomeEmail } = require('../services/emailService');

// ============ ADMIN ACTIVITY LOGGING ============
let adminActivityLogs = [];

// @desc    Get admin activity logs
// @route   GET /api/admin/activity
// @access  Private/Admin
exports.getAdminActivity = async (req, res) => {
  try {
    const logs = adminActivityLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(logs);
  } catch (error) {
    console.error('Get admin activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add admin activity log
// @route   POST /api/admin/activity/log
// @access  Private/Admin
exports.addAdminLog = async (req, res) => {
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
    if (adminActivityLogs.length > 1000) {
      adminActivityLogs = adminActivityLogs.slice(-1000);
    }
    
    res.json({ success: true, data: log });
  } catch (error) {
    console.error('Add admin log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear admin activity logs
// @route   DELETE /api/admin/activity
// @access  Private/Admin
exports.clearAdminLogs = async (req, res) => {
  try {
    adminActivityLogs = [];
    res.json({ success: true, message: 'Logs cleared' });
  } catch (error) {
    console.error('Clear logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get admin activity stats
// @route   GET /api/admin/activity/stats
// @access  Private/Admin
exports.getAdminLogStats = async (req, res) => {
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
};

// Helper function to log admin activity
const logAdminActivity = (adminId, action, details = {}) => {
  adminActivityLogs.push({
    adminId,
    action,
    details,
    timestamp: new Date().toISOString(),
    user: { name: 'Admin' },
  });
  if (adminActivityLogs.length > 100) {
    adminActivityLogs = adminActivityLogs.slice(-100);
  }
};

// ============ SETTINGS ============
exports.getSettings = async (req, res) => {
  try {
    const settings = await AdminSettings.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await AdminSettings.getSettings();
    Object.assign(settings, req.body);
    settings.updatedAt = Date.now();
    await settings.save();
    logAdminActivity(req.user.id, 'Settings Updated', req.body);
    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ SEPARATE UPLOAD FUNCTIONS ============

exports.uploadHeroVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' });
    }
    
    const settings = await AdminSettings.getSettings();
    
    if (settings.heroVideo) {
      try {
        const publicId = settings.heroVideo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`temple/hero/${publicId}`, { resource_type: 'video' });
      } catch (error) {
        console.log('Old video deletion skipped:', error.message);
      }
    }
    
    settings.heroVideo = req.file.path;
    await settings.save();
    logAdminActivity(req.user.id, 'Hero Video Uploaded', { url: req.file.path });
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Upload hero video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const settings = await AdminSettings.getSettings();
    
    if (settings.logo.photo) {
      try {
        const publicId = settings.logo.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`temple/logo/${publicId}`);
      } catch (error) {
        console.log('Old logo deletion skipped:', error.message);
      }
    }
    
    settings.logo.photo = req.file.path;
    await settings.save();
    logAdminActivity(req.user.id, 'Logo Updated', { url: req.file.path });
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadAboutPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const settings = await AdminSettings.getSettings();
    
    if (settings.about.photo) {
      try {
        const publicId = settings.about.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`temple/about/${publicId}`);
      } catch (error) {
        console.log('Old about photo deletion skipped:', error.message);
      }
    }
    
    settings.about.photo = req.file.path;
    await settings.save();
    logAdminActivity(req.user.id, 'About Photo Updated', { url: req.file.path });
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Upload about photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadQRPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const settings = await AdminSettings.getSettings();
    
    if (settings.donate.qrPhoto) {
      try {
        const publicId = settings.donate.qrPhoto.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`temple/qr/${publicId}`);
      } catch (error) {
        console.log('Old QR photo deletion skipped:', error.message);
      }
    }
    
    settings.donate.qrPhoto = req.file.path;
    await settings.save();
    logAdminActivity(req.user.id, 'QR Photo Updated', { url: req.file.path });
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Upload QR photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadTeamPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    const { teamId } = req.body;
    if (!teamId || teamId === 'new') {
      return res.json({ url: req.file.path });
    }
    
    const teamMember = await Team.findById(teamId);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    if (teamMember.photo) {
      try {
        const publicId = teamMember.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`temple/team/${publicId}`);
      } catch (error) {
        console.log('Old team photo deletion skipped:', error.message);
      }
    }
    
    teamMember.photo = req.file.path;
    await teamMember.save();
    
    res.json({ url: req.file.path, teamMember });
  } catch (error) {
    console.error('Upload team photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadHistoryPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image uploaded' 
      });
    }
    
    const { historyId } = req.body;
    if (!historyId) {
      return res.status(400).json({ 
        success: false, 
        message: 'History ID is required' 
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(historyId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid History ID format' 
      });
    }
    
    const historyItem = await History.findById(historyId);
    if (!historyItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'History item not found' 
      });
    }
    
    if (historyItem.photo) {
      try {
        const publicId = historyItem.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`temple/history/${publicId}`);
      } catch (error) {
        console.log('Old history photo deletion skipped:', error.message);
      }
    }
    
    historyItem.photo = req.file.path;
    await historyItem.save();
    logAdminActivity(req.user.id, 'History Photo Updated', { historyId, url: req.file.path });
    
    res.json({ 
      success: true, 
      url: req.file.path, 
      historyItem,
      message: 'History photo uploaded successfully'
    });
  } catch (error) {
    console.error('Upload history photo error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

exports.uploadEventPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image uploaded' 
      });
    }
    
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Event ID is required' 
      });
    }
    
    const eventItem = await Event.findById(eventId);
    if (!eventItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    if (eventItem.photo) {
      try {
        const publicId = eventItem.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`temple/event/${publicId}`);
      } catch (error) {
        console.log('Old event photo deletion skipped:', error.message);
      }
    }
    
    eventItem.photo = req.file.path;
    await eventItem.save();
    logAdminActivity(req.user.id, 'Event Photo Updated', { eventId, url: req.file.path });
    
    res.json({ 
      success: true, 
      url: req.file.path, 
      eventItem,
      message: 'Event photo uploaded successfully'
    });
  } catch (error) {
    console.error('Upload event photo error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

exports.uploadGalleryPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    const { cap, hue } = req.body;
    const galleryItem = await Gallery.create({
      photo: req.file.path,
      cap: cap ? JSON.parse(cap) : { en: 'Temple Photo' },
      type: 'photo',
      hue: hue || '#7A1F2B',
    });
    logAdminActivity(req.user.id, 'Gallery Photo Added', { 
      galleryId: galleryItem._id, 
      url: req.file.path 
    });
    
    res.status(201).json({ url: req.file.path, galleryItem });
  } catch (error) {
    console.error('Upload gallery photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadFooterImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    const settings = await AdminSettings.getSettings();
    
    if (!settings.footer) settings.footer = {};
    settings.footer.bgImage = req.file.path;
    settings.footer.bgType = 'image';
    await settings.save();
    
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Upload footer image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadFooterVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' });
    }
    
    const settings = await AdminSettings.getSettings();
    
    if (!settings.footer) settings.footer = {};
    settings.footer.bgVideo = req.file.path;
    settings.footer.bgType = 'video';
    await settings.save();
    
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Upload footer video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ USERS ============
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    logAdminActivity(req.user.id, 'User Role Updated', { userId: id, newRole: role });
    res.json(user);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    logAdminActivity(req.user.id, 'User Deleted', { userId: id, userEmail: user.email });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ BOOKINGS ============
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    logAdminActivity(req.user.id, 'Booking Status Updated', { 
      bookingId: id, 
      newStatus: status,
      bookingType: booking.type 
    });
    res.json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ DONATIONS ============
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.json(donations);
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    const oldStatus = donation.status;
    donation.status = status;
    await donation.save();
    
    logAdminActivity(req.user.id, 'Donation Status Updated', { 
      donationId: id, 
      oldStatus,
      newStatus: status,
      donorName: donation.name,
      amount: donation.amount 
    });
    
    if (status === 'completed' && oldStatus !== 'completed') {
      try {
        const user = await User.findById(donation.userId);
        if (user) {
          const { generateReceiptPDF } = require('../services/pdfService');
          const { sendDonationConfirmationWithPDF } = require('../services/emailService');
          const pdfBuffer = await generateReceiptPDF(donation, user);
          await sendDonationConfirmationWithPDF(donation, user, pdfBuffer);
          console.log(`✅ Receipt sent to ${user.email}`);
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
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
};

exports.deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByIdAndDelete(id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    logAdminActivity(req.user.id, 'Donation Deleted', { 
      donationId: id, 
      donorName: donation.name,
      amount: donation.amount 
    });
    res.json({ success: true, message: 'Donation deleted' });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ HISTORY ============
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find().sort({ order: 1, createdAt: 1 });
    res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addHistory = async (req, res) => {
  try {
    const history = await History.create(req.body);
    logAdminActivity(req.user.id, 'History Entry Added', { 
      historyId: history._id,
      title: history.title 
    });
    res.status(201).json(history);
  } catch (error) {
    console.error('Add history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await History.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!history) {
      return res.status(404).json({ message: 'History entry not found' });
    }
    logAdminActivity(req.user.id, 'History Entry Updated', { 
      historyId: id,
      title: history.title 
    });
    res.json(history);
  } catch (error) {
    console.error('Update history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await History.findByIdAndDelete(id);
    if (!history) {
      return res.status(404).json({ message: 'History entry not found' });
    }
    logAdminActivity(req.user.id, 'History Entry Deleted', { 
      historyId: id,
      title: history.title 
    });
    res.json({ success: true, message: 'History entry deleted' });
  } catch (error) {
    console.error('Delete history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ TEAM ============
exports.getTeam = async (req, res) => {
  try {
    const team = await Team.find().sort({ order: 1, createdAt: 1 });
    res.json(team);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTeam = async (req, res) => {
  try {
    const teamMember = await Team.create(req.body);
    
    if (teamMember.email) {
      try {
        await sendTeamWelcomeEmail(teamMember);
        console.log(`✅ Welcome email sent to ${teamMember.email}`);
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    }
    
    logAdminActivity(req.user.id, 'Team Member Added', { 
      memberId: teamMember._id,
      name: teamMember.name 
    });
    
    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Add team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await Team.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    logAdminActivity(req.user.id, 'Team Member Updated', { 
      memberId: id,
      name: teamMember.name 
    });
    
    res.json(teamMember);
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await Team.findByIdAndDelete(id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    logAdminActivity(req.user.id, 'Team Member Deleted', { 
      memberId: id,
      name: teamMember.name 
    });
    
    res.json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ GALLERY ============
exports.getGallery = async (req, res) => {
  try {
    const photos = await Gallery.find({ type: 'photo' }).sort({ createdAt: -1 });
    res.json(photos);
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addGalleryPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    let data = {};
    try {
      data = req.body.data ? JSON.parse(req.body.data) : {};
    } catch (e) {
      data = {};
    }

    const galleryItem = await Gallery.create({
      photo: req.file.path,
      cap: data.cap || { en: 'Temple Photo' },
      type: 'photo',
      hue: data.hue || '#7A1F2B',
      category: data.category || 'general',
    });

    logAdminActivity(req.user.id, 'Gallery Photo Added', { 
      galleryId: galleryItem._id,
      category: data.category || 'general' 
    });

    res.status(201).json({
      success: true,
      data: galleryItem,
      message: 'Photo added successfully',
    });
  } catch (error) {
    console.error('Add gallery photo error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

exports.deleteGalleryPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Gallery.findByIdAndDelete(id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.photo) {
      try {
        const publicId = photo.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`temple/gallery/${publicId}`);
      } catch (error) {
        console.log('Cloudinary deletion skipped:', error.message);
      }
    }

    logAdminActivity(req.user.id, 'Gallery Photo Deleted', { 
      galleryId: id,
      caption: photo.cap 
    });

    res.json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    console.error('Delete gallery photo error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

exports.getGalleryVideos = async (req, res) => {
  try {
    const videos = await Gallery.find({ type: 'video' }).sort({ createdAt: -1 });
    res.json(videos || []);
  } catch (error) {
    console.error('Get gallery videos error:', error);
    res.json([]);
  }
};

exports.deleteGalleryVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Gallery.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    logAdminActivity(req.user.id, 'Gallery Video Deleted', { videoId: id });
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    console.error('Delete gallery video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ GALLERY MANAGEMENT (Complete) ============

exports.getAllGalleryItems = async (req, res) => {
  try {
    const { type, category, search } = req.query;
    let filter = {};
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { 'cap.en': { $regex: search, $options: 'i' } },
        { 'cap.ne': { $regex: search, $options: 'i' } },
        { 'cap.hi': { $regex: search, $options: 'i' } },
      ];
    }
    
    const items = await Gallery.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: items,
      total: items.length,
    });
  } catch (error) {
    console.error('Get all gallery items error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

exports.getGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gallery item not found' 
      });
    }
    
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Get gallery item error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

exports.addGalleryVideo = async (req, res) => {
  try {
    let videoData = {};
    
    if (req.file) {
      videoData.url = req.file.path;
      videoData.type = 'video';
      videoData.photo = req.file.path;
    } else if (req.body.url) {
      videoData.url = req.body.url;
      videoData.type = 'video';
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Video file or URL is required' 
      });
    }
    
    let cap = { en: 'Temple Video' };
    if (req.body.cap) {
      try {
        cap = typeof req.body.cap === 'string' ? JSON.parse(req.body.cap) : req.body.cap;
      } catch (e) {
        cap = { en: req.body.cap };
      }
    }
    
    const video = await Gallery.create({
      ...videoData,
      cap,
      type: 'video',
      hue: req.body.hue || '#1a1a2e',
      category: req.body.category || 'videos',
    });

    logAdminActivity(req.user.id, 'Gallery Video Added', { 
      videoId: video._id,
      category: req.body.category || 'videos' 
    });
    
    res.status(201).json({
      success: true,
      data: video,
      message: 'Video added successfully',
    });
  } catch (error) {
    console.error('Add gallery video error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { cap, category, hue, url } = req.body;
    
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gallery item not found' 
      });
    }
    
    if (cap) item.cap = cap;
    if (category) item.category = category;
    if (hue) item.hue = hue;
    if (url) item.url = url;
    
    await item.save();
    logAdminActivity(req.user.id, 'Gallery Item Updated', { 
      galleryId: id,
      category: category || item.category 
    });
    
    res.json({
      success: true,
      data: item,
      message: 'Gallery item updated successfully',
    });
  } catch (error) {
    console.error('Update gallery item error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gallery item not found' 
      });
    }
    
    if (item.photo) {
      try {
        const publicId = item.photo.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`temple/gallery/${publicId}`);
      } catch (error) {
        console.log('Cloudinary deletion skipped:', error.message);
      }
    }
    
    await item.deleteOne();
    logAdminActivity(req.user.id, 'Gallery Item Deleted', { 
      galleryId: id,
      type: item.type,
      category: item.category 
    });
    
    res.json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

exports.bulkDeleteGalleryItems = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of IDs' 
      });
    }
    
    const results = [];
    const deletedIds = [];
    for (const id of ids) {
      try {
        const item = await Gallery.findById(id);
        if (item) {
          if (item.photo) {
            try {
              const publicId = item.photo.split('/').pop().split('.')[0];
              await cloudinary.uploader.destroy(`temple/gallery/${publicId}`);
            } catch (error) {
              console.log('Cloudinary deletion skipped:', error.message);
            }
          }
          await item.deleteOne();
          results.push({ id, success: true });
          deletedIds.push(id);
        } else {
          results.push({ id, success: false, message: 'Not found' });
        }
      } catch (error) {
        results.push({ id, success: false, message: error.message });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    
    if (deletedIds.length > 0) {
      logAdminActivity(req.user.id, 'Gallery Items Bulk Deleted', { 
        deletedIds,
        count: deletedIds.length 
      });
    }
    
    res.json({
      success: true,
      results,
      total: results.length,
      successCount,
      failedCount: results.length - successCount,
    });
  } catch (error) {
    console.error('Bulk delete gallery items error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

// ============ DASHBOARD STATS ============
exports.getDashboardStats = async (req, res) => {
  try {
    const [users, events, bookings, donations, settings] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Booking.countDocuments(),
      Donation.countDocuments(),
      AdminSettings.getSettings(),
    ]);

    logAdminActivity(req.user.id, 'Dashboard Stats Accessed');

    res.json({
      success: true,
      data: {
        totalUsers: users,
        totalEvents: events,
        totalBookings: bookings,
        totalDonations: donations,
        totalDonors: settings.donate.baseCount + donations,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ RECENT ACTIVITY ============
exports.getRecentActivity = async (req, res) => {
  try {
    const [recentBookings, recentDonations, recentUsers] = await Promise.all([
      Booking.find().sort({ createdAt: -1 }).limit(5),
      Donation.find().sort({ date: -1 }).limit(5),
      User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
    ]);

    const activities = [
      ...recentBookings.map(b => ({
        type: 'booking',
        message: `New booking: ${b.name} - ${b.type}`,
        date: b.createdAt,
        data: b,
      })),
      ...recentDonations.map(d => ({
        type: 'donation',
        message: `New donation from ${d.name}`,
        date: d.date,
        data: d,
      })),
      ...recentUsers.map(u => ({
        type: 'user',
        message: `New user registered: ${u.name}`,
        date: u.createdAt,
        data: u,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};