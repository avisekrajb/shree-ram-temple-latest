const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ============================================
// CORS CONFIGURATION - Allow all origins in production
// ============================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'https://shree-ram-temple.onrender.com',
  'https://shree-ram-temple-latest-backend.onrender.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('⚠️ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// ============================================
// SESSION CONFIGURATION
// ============================================
app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
  },
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// ============================================
// BODY PARSERS
// ============================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================
// LOGGING MIDDLEWARE
// ============================================
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  console.log(`📍 Origin: ${req.headers.origin || 'unknown'}`);
  next();
});

// ============================================
// ROUTES
// ============================================
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const donationRoutes = require('./routes/donationRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    allowedOrigins: allowedOrigins,
  });
});

// ============================================
// ROOT ENDPOINT
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'Shree Ramchandra Temple API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      admin: '/api/admin',
      events: '/api/events',
      bookings: '/api/bookings',
      donations: '/api/donations',
      gallery: '/api/gallery',
      contact: '/api/contact',
      health: '/api/health',
    },
  });
});

// ============================================
// ERROR HANDLER
// ============================================
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} not found` 
  });
});

module.exports = app;
