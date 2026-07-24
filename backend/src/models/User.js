const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() {
      // Only required for non-Google users
      return !this.googleId;
    },
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: function() {
      // Only required for non-Google users
      return !this.googleId;
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  phone: {
    type: String,
    required: function() {
      // Only required for non-Google users
      return !this.googleId;
    },
    trim: true,
    default: '',
  },
  address: {
    type: String,
    required: function() {
      // Only required for non-Google users
      return !this.googleId;
    },
    trim: true,
    default: '',
  },
  profilePhoto: {
    type: String,
    default: null,
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving (only if password is modified and not a Google user)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (this.googleId && !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);