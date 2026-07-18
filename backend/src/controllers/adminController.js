const AdminSettings = require('../models/AdminSettings');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Donation = require('../models/Donation');
const History = require('../models/History');
const Team = require('../models/Team');
const Gallery = require('../models/Gallery');
const Event = require('../models/Event');
const cloudinary = require('../config/cloudinary');

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
    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ SEPARATE UPLOAD FUNCTIONS ============

// 1. Hero Video Upload
exports.uploadHeroVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' });
    }
    
    const settings = await AdminSettings.getSettings();
    
    // Delete old video from Cloudinary if exists
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
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Upload hero video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Logo Upload
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
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. About Photo Upload (separate)
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
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Upload about photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. QR Photo Upload
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
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Upload QR photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Team Photo Upload (separate from About)
exports.uploadTeamPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    const { teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ message: 'Team ID is required' });
    }
    
    const teamMember = await Team.findById(teamId);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    // Delete old team photo from Cloudinary if exists
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

// 6. History Photo Upload
exports.uploadHistoryPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    const { historyId } = req.body;
    if (!historyId) {
      return res.status(400).json({ message: 'History ID is required' });
    }
    
    const historyItem = await History.findById(historyId);
    if (!historyItem) {
      return res.status(404).json({ message: 'History item not found' });
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
    
    res.json({ url: req.file.path, historyItem });
  } catch (error) {
    console.error('Upload history photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 7. Event Photo Upload
exports.uploadEventPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }
    
    const eventItem = await Event.findById(eventId);
    if (!eventItem) {
      return res.status(404).json({ message: 'Event not found' });
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
    
    res.json({ url: req.file.path, eventItem });
  } catch (error) {
    console.error('Upload event photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 8. Gallery Photo Upload
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
    
    res.status(201).json({ url: req.file.path, galleryItem });
  } catch (error) {
    console.error('Upload gallery photo error:', error);
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

exports.deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByIdAndDelete(id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json({ success: true, message: 'Donation deleted' });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ HISTORY ============
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: 1 });
    res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addHistory = async (req, res) => {
  try {
    const history = await History.create(req.body);
    res.status(201).json(history);
  } catch (error) {
    console.error('Add history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await History.findByIdAndUpdate(id, req.body, { new: true });
    if (!history) {
      return res.status(404).json({ message: 'History entry not found' });
    }
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
    res.json({ success: true, message: 'History entry deleted' });
  } catch (error) {
    console.error('Delete history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ TEAM ============
exports.getTeam = async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: 1 });
    res.json(team);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTeam = async (req, res) => {
  try {
    const member = await Team.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    console.error('Add team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Team.findByIdAndUpdate(id, req.body, { new: true });
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(member);
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Team.findByIdAndDelete(id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
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
    const data = req.body.data ? JSON.parse(req.body.data) : {};
    const photo = await Gallery.create({
      photo: req.file.path,
      cap: data.cap || { en: 'Temple Photo' },
      type: 'photo',
      hue: data.hue || '#7A1F2B',
    });
    res.status(201).json(photo);
  } catch (error) {
    console.error('Add gallery photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteGalleryPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Gallery.findByIdAndDelete(id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.json({ success: true, message: 'Photo deleted' });
  } catch (error) {
    console.error('Delete gallery photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGalleryVideos = async (req, res) => {
  try {
    const videos = await Gallery.find({ type: 'video' }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Get gallery videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addGalleryVideo = async (req, res) => {
  try {
    const { url, cap } = req.body;
    const video = await Gallery.create({
      url,
      cap: cap || { en: 'Temple Video' },
      type: 'video',
    });
    res.status(201).json(video);
  } catch (error) {
    console.error('Add gallery video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteGalleryVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Gallery.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    console.error('Delete gallery video error:', error);
    res.status(500).json({ message: 'Server error' });
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