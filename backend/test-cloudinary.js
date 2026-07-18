// backend/test-cloudinary.js
require('dotenv').config();
const cloudinary = require('./src/config/cloudinary');

(async () => {
  console.log('🔍 Testing Cloudinary Configuration...');
  console.log('📋 Environment Variables:');
  console.log(`  CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME || '❌ Missing'}`);
  console.log(`  CLOUDINARY_API_KEY: ${process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`  CLOUDINARY_API_SECRET: ${process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log('');

  try {
    // Test ping
    console.log('📡 Testing Cloudinary ping...');
    const ping = await cloudinary.api.ping();
    console.log('✅ Ping successful:', ping);
    console.log('');

    // Test listing resources
    console.log('📁 Fetching resources...');
    const resources = await cloudinary.api.resources({
      resource_type: 'image',
      max_results: 10,
    });
    console.log(`✅ Found ${resources.resources?.length || 0} images`);
    
    if (resources.resources && resources.resources.length > 0) {
      console.log('📸 Sample resources:');
      resources.resources.slice(0, 3).forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.public_id} (${r.format}) - ${r.bytes} bytes`);
      });
    } else {
      console.log('📭 No images found in your Cloudinary account');
    }
    console.log('');

    // Test videos
    console.log('🎬 Fetching videos...');
    const videos = await cloudinary.api.resources({
      resource_type: 'video',
      max_results: 10,
    });
    console.log(`✅ Found ${videos.resources?.length || 0} videos`);
    console.log('');

    console.log('🎉 Cloudinary is working correctly!');
  } catch (error) {
    console.error('❌ Error:', error.message || error);
    if (error.http_code) {
      console.error(`  HTTP Code: ${error.http_code}`);
    }
    if (error.error) {
      console.error(`  Cloudinary Error: ${error.error.message || JSON.stringify(error.error)}`);
    }
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('  1. Make sure your .env file exists in the backend folder');
    console.log('  2. Check that CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set');
    console.log('  3. Verify your Cloudinary credentials from the Cloudinary dashboard');
    console.log('  4. Make sure your API key has the necessary permissions');
  }
})();