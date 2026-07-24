const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Wrap in async function for better error handling
const startServer = async () => {
  try {
    // Connect to MongoDB with error handling
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: ${process.env.NODE_ENV === 'production' 
        ? 'https://shree-ram-temple-latest-backend.onrender.com/api/health'
        : `http://localhost:${PORT}/api/health`
      }`);
      console.log(`✅ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Rejection:', err);
      server.close(() => {
        console.log('Server closed due to unhandled rejection');
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      server.close(() => {
        console.log('Server closed due to uncaught exception');
        process.exit(1);
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing server...');
      server.close(() => {
        console.log('Server closed gracefully');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, closing server...');
      server.close(() => {
        console.log('Server closed gracefully');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

// Start the server
startServer();
