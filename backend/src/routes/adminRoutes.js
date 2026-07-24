const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const {
  // Settings
  getSettings,
  updateSettings,
  
  // Uploads
  uploadHeroVideo,
  uploadLogo,
  uploadAboutPhoto,
  uploadQRPhoto,
  uploadTeamPhoto,
  uploadHistoryPhoto,
  uploadEventPhoto,
  uploadGalleryPhoto,
  uploadFooterImage,
  uploadFooterVideo,
  
  // Users
  getAllUsers,
  updateUserRole,
  deleteUser,
  
  // Bookings
  getAllBookings,
  updateBookingStatus,
  
  // Donations
  getAllDonations,
  updateDonationStatus,
  deleteDonation,
  
  // History
  getHistory,
  addHistory,
  updateHistory,
  deleteHistory,
  
  // Team
  getTeam,
  addTeam,
  updateTeam,
  deleteTeam,
  
  // Gallery
  getGallery,
  addGalleryPhoto,
  deleteGalleryPhoto,
  getGalleryVideos,
  addGalleryVideo,
  deleteGalleryVideo,
  getAllGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  bulkDeleteGalleryItems,
  
  // Admin Activity
  getAdminActivity,
} = require('../controllers/adminController');

// Blog Controllers
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublish,
} = require('../controllers/blogController');

// Cloud Controllers
const {
  getCloudResources,
  getCloudResource,
  deleteCloudResource,
  deleteMultipleCloudResources,
  getCloudStats,
  searchCloudResources,
} = require('../controllers/cloudController');

// ============ EVENT CONTROLLERS ============
const {
  getAllEvents,
  getUpcomingEvents,
  getPastEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Settings - public for frontend
router.get('/settings', getSettings);

// History - public for frontend (GET only)
router.get('/history', getHistory);

// Team - public for frontend
router.get('/team', getTeam);

// Blogs - public for frontend
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);

// Events - public for frontend
router.get('/events', getAllEvents);
router.get('/events/upcoming', getUpcomingEvents);
router.get('/events/past', getPastEvents);
router.get('/events/:id', getEventById);

// ============================================
// GALLERY - PUBLIC ROUTES (No authentication required)
// ============================================

// Get all gallery items - PUBLIC (no auth)
router.get('/gallery/all', getAllGalleryItems);

// Get gallery photos - PUBLIC (no auth)
router.get('/gallery', getGallery);

// Get gallery videos - PUBLIC (no auth)
router.get('/gallery/videos', getGalleryVideos);

// Get single gallery item - PUBLIC (no auth)
router.get('/gallery/:id', getGalleryItem);

// ============================================
// PROTECTED ROUTES (Authentication + Admin required)
// ============================================

// All routes below require admin authentication
router.use(protect, admin);

// ---------- Admin Activity ----------
router.get('/activity', getAdminActivity);

// ---------- Settings ----------
router.put('/settings', updateSettings);

// ---------- Blog Management ----------
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);
router.put('/blogs/:id/toggle', toggleBlogPublish);

// ---------- Event Management ----------
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// ---------- Cloud Management ----------
router.get('/cloud/resources', getCloudResources);
router.get('/cloud/resource/:publicId', getCloudResource);
router.delete('/cloud/resource/:publicId', deleteCloudResource);
router.post('/cloud/resources/delete', deleteMultipleCloudResources);
router.get('/cloud/stats', getCloudStats);
router.get('/cloud/search', searchCloudResources);

// ---------- Upload Routes ----------
router.post('/upload/hero', upload.single('video'), uploadHeroVideo);
router.post('/upload/logo', upload.single('image'), uploadLogo);
router.post('/upload/about', upload.single('image'), uploadAboutPhoto);
router.post('/upload/qr', upload.single('image'), uploadQRPhoto);
router.post('/upload/team', upload.single('image'), uploadTeamPhoto);
router.post('/upload/history', upload.single('image'), uploadHistoryPhoto);
router.post('/upload/event', upload.single('image'), uploadEventPhoto);
router.post('/upload/gallery', upload.single('image'), uploadGalleryPhoto);
router.post('/upload/footer', upload.single('image'), uploadFooterImage);
router.post('/upload/footer/video', upload.single('video'), uploadFooterVideo);

// ---------- Booking Background Photo Upload ----------
router.post('/upload/booking-bg', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Upload booking bg error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------- User Management ----------
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// ---------- Booking Management ----------
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// ---------- Donation Management ----------
router.get('/donations', getAllDonations);
router.put('/donations/:id/status', updateDonationStatus);
router.delete('/donations/:id', deleteDonation);

// ---------- History Management (Protected Admin Routes) ----------
// GET is public (defined above), but POST, PUT, DELETE are admin only
router.post('/history', addHistory);
router.put('/history/:id', updateHistory);
router.delete('/history/:id', deleteHistory);

// ---------- Team Management ----------
router.post('/team', addTeam);
router.put('/team/:id', updateTeam);
router.delete('/team/:id', deleteTeam);

// ---------- Gallery Management (Protected Admin Routes) ----------
// GET routes are public (defined above)
// POST, PUT, DELETE are admin only
router.post('/gallery', upload.single('photo'), addGalleryPhoto);
router.post('/gallery/videos', addGalleryVideo);
router.post('/gallery/video', upload.single('video'), addGalleryVideo);
router.put('/gallery/:id', updateGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);
router.delete('/gallery/videos/:id', deleteGalleryVideo);
router.delete('/gallery/bulk', bulkDeleteGalleryItems);

module.exports = router;