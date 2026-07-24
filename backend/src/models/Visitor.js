const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  userName: {
    type: String,
    default: '',
  },
  page: {
    type: String,
    required: true,
  },
  pageTitle: {
    type: String,
    default: '',
  },
  referrer: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'tablet', 'mobile', 'unknown'],
    default: 'unknown',
  },
  browser: {
    type: String,
    default: '',
  },
  os: {
    type: String,
    default: '',
  },
  location: {
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    region: { type: String, default: '' },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    timezone: { type: String, default: '' },
    isp: { type: String, default: '' },
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
  isNewVisitor: {
    type: Boolean,
    default: true,
  },
  visitCount: {
    type: Number,
    default: 1,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  day: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  month: {
    type: String,
    default: () => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    },
  },
  year: {
    type: Number,
    default: () => new Date().getFullYear(),
  },
  entryPage: {
    type: String,
    default: '',
  },
  exitPage: {
    type: String,
    default: '',
  },
});

visitorSchema.index({ sessionId: 1, date: -1 });
visitorSchema.index({ ipAddress: 1, date: -1 });
visitorSchema.index({ page: 1, date: -1 });
visitorSchema.index({ day: 1 });
visitorSchema.index({ month: 1 });

module.exports = mongoose.model('Visitor', visitorSchema);
