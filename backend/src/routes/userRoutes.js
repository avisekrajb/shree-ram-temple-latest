const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Upload profile photo
// @route   POST /api/users/upload-profile-photo
// @access  Private
router.post('/upload-profile-photo', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile photo from Cloudinary if exists
    if (user.profilePhoto) {
      try {
        const publicId = user.profilePhoto.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`profile/${publicId}`);
      } catch (error) {
        console.log('Old profile photo deletion skipped:', error.message);
      }
    }

    user.profilePhoto = req.file.path;
    await user.save();

    res.json({ url: req.file.path });
  } catch (error) {
    console.error('Upload profile photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Remove profile photo
// @route   DELETE /api/users/profile-photo
// @access  Private
router.delete('/profile-photo', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete from Cloudinary
    if (user.profilePhoto) {
      try {
        const publicId = user.profilePhoto.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`profile/${publicId}`);
      } catch (error) {
        console.log('Profile photo deletion skipped:', error.message);
      }
    }

    user.profilePhoto = null;
    await user.save();

    res.json({ success: true, message: 'Profile photo removed' });
  } catch (error) {
    console.error('Remove profile photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;