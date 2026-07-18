const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  photo: {
    type: String,
    default: null,
  },
  hue: {
    type: String,
    default: '#7A1F2B',
  },
  cap: {
    en: { type: String, required: true },
    ne: { type: String, default: '' },
    hi: { type: String, default: '' },
    zh: { type: String, default: '' },
    ta: { type: String, default: '' },
  },
  type: {
    type: String,
    enum: ['photo', 'video'],
    default: 'photo',
  },
  url: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Gallery', gallerySchema);