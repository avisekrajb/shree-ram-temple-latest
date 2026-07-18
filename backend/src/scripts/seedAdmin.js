// backend/src/scripts/seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'a@gmail.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('123456', 12);
    const admin = new User({
      name: 'Administrator',
      email: 'a@gmail.com',
      password: hashedPassword,
      phone: '9800000000',
      address: 'Kathmandu, Nepal',
      role: 'admin',
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: a@gmail.com');
    console.log('🔑 Password: 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();