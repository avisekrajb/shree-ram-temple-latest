// backend/test-login.js
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// Load environment variables
dotenv.config();

const testLogin = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB with proper options
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Find user
    console.log('🔍 Looking for admin user...');
    const user = await User.findOne({ email: 'a@gmail.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      console.log('💡 Run: npm run seed to create admin user');
      process.exit(1);
    }
    
    console.log('✅ User found:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔒 Role:', user.role);
    console.log('🔑 Hashed password:', user.password.substring(0, 20) + '...');
    
    // Test password
    const testPassword = '123456';
    console.log(`\n🔐 Testing password: "${testPassword}"`);
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log(`📝 Password is ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    
    if (isValid) {
      console.log('\n🎉 Login should work with:');
      console.log('📧 Email: a@gmail.com');
      console.log('🔑 Password: 123456');
    } else {
      console.log('\n⚠️ Password is invalid. Run: npm run seed:force to reset');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Run the test
testLogin();