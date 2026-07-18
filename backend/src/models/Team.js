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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Team', teamSchema);