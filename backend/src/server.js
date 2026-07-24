const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import your routes
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// etc.

const app = express();

// ==================== CORS CONFIGURATION ====================
// MUST be before any routes and middleware

const allowedOrigins = [
  'https://shree-ram-temple.onrender.com',           // Your frontend
  'https://shree-ram-temple-latest-backend.onrender.com', // Your backend
  'http://localhost:3000',                           // Local frontend
  'http://localhost:5000',                           // Local backend
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours cache for preflight
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests globally
app.options('*', cors(corsOptions));

// ==================== MIDDLEWARE ====================

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (optional)
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// ==================== ROUTES ====================

// Health check endpoint (for testing)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS is working! 🎉',
    origin: req.headers.origin || 'No origin',
    timestamp: new Date().toISOString()
  });
});

// Your API routes here
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/ram-temple', templeRoutes);
// etc.

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // CORS error handling
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      error: 'Origin not allowed'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==================== EXPORT ====================

module.exports = app;
