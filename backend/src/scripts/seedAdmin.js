// backend/src/scripts/seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin
    console.log('🔍 Checking for existing admin...');
    await User.deleteOne({ email: 'a@gmail.com' });
    console.log('✅ Old admin removed (if existed)');

    // Create admin user - let the model's pre-save hook hash the password
    console.log('🔑 Creating new admin user...');
    const admin = new User({
      name: 'Administrator',
      email: 'a@gmail.com',
      password: '123456', // Let the model hash it
      phone: '9800000000',
      address: 'Kathmandu, Nepal',
      role: 'admin',
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: a@gmail.com');
    console.log('🔑 Password: 123456');
    
    // Verify
    console.log('🔍 Verifying admin user...');
    const verifyUser = await User.findOne({ email: 'a@gmail.com' }).select('+password');
    if (verifyUser) {
      console.log('✅ Admin verified in database');
      console.log(`👤 Name: ${verifyUser.name}`);
      console.log(`🔒 Role: ${verifyUser.role}`);
      console.log(`🔑 Hashed password: ${verifyUser.password.substring(0, 30)}...`);
      
      // Test password using the model's compare method
      const isValid = await verifyUser.comparePassword('123456');
      console.log(`🔐 Password is ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      
      if (isValid) {
        console.log('\n🎉 Admin user is ready!');
        console.log('📧 Email: a@gmail.com');
        console.log('🔑 Password: 123456');
      } else {
        console.log('\n⚠️ Password is still invalid. Checking manually...');
        // Manual check
        const manualCheck = await bcrypt.compare('123456', verifyUser.password);
        console.log(`Manual check: ${manualCheck ? '✅ VALID' : '❌ INVALID'}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedAdmin();