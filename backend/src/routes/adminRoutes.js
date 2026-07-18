const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const {
  getSettings,
  updateSettings,
  uploadHeroVideo,
  uploadLogo,
  uploadAboutPhoto,
  uploadQRPhoto,
  uploadTeamPhoto,
  uploadHistoryPhoto,
  uploadEventPhoto,
  uploadGalleryPhoto,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllBookings,
  updateBookingStatus,
  getAllDonations,
  deleteDonation,
  getHistory,
  addHistory,
  updateHistory,
  deleteHistory,
  getTeam,
  addTeam,
  updateTeam,
  deleteTeam,
  getGallery,
  addGalleryPhoto,
  deleteGalleryPhoto,
  getGalleryVideos,
  addGalleryVideo,
  deleteGalleryVideo,
} = require('../controllers/adminController');

// Cloud Controllers
const {
  getCloudResources,
  getCloudResource,
  deleteCloudResource,
  deleteMultipleCloudResources,
  getCloudStats,
  searchCloudResources,
} = require('../controllers/cloudController');

// Public routes (no auth required)
router.get('/settings', getSettings);
router.get('/history', getHistory);
router.get('/team', getTeam);

// All other admin routes require authentication and admin role
router.use(protect, admin);

// Settings
router.put('/settings', updateSettings);

// Cloud Management Routes
router.get('/cloud/resources', getCloudResources);
router.get('/cloud/resource/:publicId', getCloudResource);
router.delete('/cloud/resource/:publicId', deleteCloudResource);
router.post('/cloud/resources/delete', deleteMultipleCloudResources);
router.get('/cloud/stats', getCloudStats);
router.get('/cloud/search', searchCloudResources);

// Upload Routes
router.post('/upload/hero', upload.single('video'), uploadHeroVideo);
router.post('/upload/logo', upload.single('image'), uploadLogo);
router.post('/upload/about', upload.single('image'), uploadAboutPhoto);
router.post('/upload/qr', upload.single('image'), uploadQRPhoto);
router.post('/upload/team', upload.single('image'), uploadTeamPhoto);
router.post('/upload/history', upload.single('image'), uploadHistoryPhoto);
router.post('/upload/event', upload.single('image'), uploadEventPhoto);
router.post('/upload/gallery', upload.single('image'), uploadGalleryPhoto);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Bookings
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Donations
router.get('/donations', getAllDonations);
router.delete('/donations/:id', deleteDonation);

// History
router.post('/history', addHistory);
router.put('/history/:id', updateHistory);
router.delete('/history/:id', deleteHistory);

// Team
router.post('/team', addTeam);
router.put('/team/:id', updateTeam);
router.delete('/team/:id', deleteTeam);

// Gallery
router.get('/gallery', getGallery);
router.post('/gallery', upload.single('photo'), addGalleryPhoto);
router.delete('/gallery/:id', deleteGalleryPhoto);

router.get('/gallery/videos', getGalleryVideos);
router.post('/gallery/videos', addGalleryVideo);
router.delete('/gallery/videos/:id', deleteGalleryVideo);

module.exports = router;