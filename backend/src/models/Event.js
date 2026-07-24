const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: null,
  },
  upcoming: {
    type: Boolean,
    default: true,
  },
  title: {
    en: { type: String, required: true },
    ne: { type: String, default: '' },
    hi: { type: String, default: '' },
    zh: { type: String, default: '' },
    ta: { type: String, default: '' },
  },
  desc: {
    en: { type: String, required: true },
    ne: { type: String, default: '' },
    hi: { type: String, default: '' },
    zh: { type: String, default: '' },
    ta: { type: String, default: '' },
  },
  dateNepali: {
    en: { type: String, default: '' },
    ne: { type: String, default: '' },
    hi: { type: String, default: '' },
    zh: { type: String, default: '' },
    ta: { type: String, default: '' },
  },
  greg: {
    en: { type: String, default: '' },
    ne: { type: String, default: '' },
    hi: { type: String, default: '' },
    zh: { type: String, default: '' },
    ta: { type: String, default: '' },
  },
  // NEW FIELDS - Add these
  interestedCount: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  shareCount: {
    type: Number,
    default: 0,
  },
  interestedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
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
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Event', eventSchema);