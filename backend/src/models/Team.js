const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  photo: {
    type: String,
    default: null,
  },
  name: {
    en: { type: String, required: true },
    ne: { type: String, default: '' },
    hi: { type: String, default: '' },
    zh: { type: String, default: '' },
    ta: { type: String, default: '' },
  },
  role: {
    en: { type: String, required: true },
    ne: { type: String, default: '' },
    hi: { type: String, default: '' },
    zh: { type: String, default: '' },
    ta: { type: String, default: '' },
  },
  bio: {
    en: { type: String, default: '' },
    ne: { type: String, default: '' },
    hi: { type: String, default: '' },
    zh: { type: String, default: '' },
    ta: { type: String, default: '' },
  },
  email: {
    type: String,
    default: '',
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

teamSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Team', teamSchema);