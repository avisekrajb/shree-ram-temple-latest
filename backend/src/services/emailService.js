const nodemailer = require('nodemailer');

// Check if email is configured
const isEmailConfigured = () => {
  return process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your-email@gmail.com';
};

// Create transporter only if configured
const createTransporter = () => {
  if (!isEmailConfigured()) {
    console.log('📧 Email not configured. Skipping email setup.');
    return null;
  }

  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 1,
    rateLimit: true,
  });
};

// Get transporter instance
let transporter = null;

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise<Object>} Nodemailer response
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Check if email is configured
    if (!isEmailConfigured()) {
      console.log('📧 Email not configured. Would have sent:', { to, subject });
      console.log('📧 Email content preview:', html?.substring(0, 100) + '...');
      return { 
        messageId: 'skipped', 
        message: 'Email not configured - would have sent',
        to,
        subject,
      };
    }

    // Create transporter if not exists
    if (!transporter) {
      transporter = createTransporter();
      if (!transporter) {
        throw new Error('Failed to create email transporter');
      }
    }

    const mailOptions = {
      from: `"Shree Ramchandra Temple" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html?.replace(/<[^>]*>/g, '') || '',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    // Don't throw - just log the error
    return { 
      error: error.message,
      message: 'Email sending failed but operation continues',
    };
  }
};

/**
 * Send booking confirmation email
 * @param {Object} booking - Booking object
 * @param {Object} user - User object
 * @returns {Promise<Object>} Nodemailer response
 */
const sendBookingConfirmation = async (booking, user) => {
  const statusMap = {
    pending: 'Pending ⏳',
    confirmed: 'Confirmed ✅',
    completed: 'Completed ✨',
    cancelled: 'Cancelled ❌',
  };

  const statusColors = {
    pending: '#F59E0B',
    confirmed: '#16A34A',
    completed: '#0EA5E9',
    cancelled: '#EF4444',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a2e;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #fafafa;
        }
        .container {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
          background: linear-gradient(135deg, #7A1F2B 0%, #5B1420 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        .header .om {
          font-size: 32px;
          display: block;
          margin-bottom: 8px;
        }
        .content {
          padding: 30px 25px;
        }
        .content p {
          margin: 8px 0;
          color: #4a4a5a;
        }
        .content .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 12px;
        }
        .details {
          background: #f8f5f3;
          padding: 18px 20px;
          border-radius: 12px;
          margin: 18px 0;
          border-left: 4px solid #7A1F2B;
        }
        .details h3 {
          margin: 0 0 10px 0;
          font-size: 16px;
          color: #7A1F2B;
        }
        .details-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #e8e4e0;
          font-size: 14px;
        }
        .details-row:last-child {
          border-bottom: none;
        }
        .details-row .label {
          color: #6b6b7a;
          font-weight: 500;
        }
        .details-row .value {
          font-weight: 600;
          color: #1a1a2e;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 13px;
          background: ${statusColors[booking.status] || '#6b6b7a'}20;
          color: ${statusColors[booking.status] || '#6b6b7a'};
        }
        .footer {
          text-align: center;
          padding: 20px;
          border-top: 1px solid #e8e4e0;
          font-size: 13px;
          color: #8a8a9a;
          background: #fafafa;
        }
        .footer .temple-name {
          font-weight: 600;
          color: #7A1F2B;
        }
        .btn {
          display: inline-block;
          padding: 10px 24px;
          background: #7A1F2B;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 10px;
        }
        .btn:hover {
          background: #5B1420;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="om">🕉</span>
          <h1>Puja Booking Confirmation</h1>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px;">Shree Ramchandra Temple, Gaushala</p>
        </div>
        <div class="content">
          <p class="greeting">Dear <strong>${user.name}</strong>,</p>
          <p>Your puja has been successfully booked at <strong>Shree Ramchandra Temple</strong>.</p>
          <p style="font-size: 14px; color: #6b6b7a;">We are honored to have you with us. May Lord Ram bless you.</p>
          
          <div class="details">
            <h3>📋 Booking Details</h3>
            <div class="details-row">
              <span class="label">Puja Type</span>
              <span class="value">${booking.type}</span>
            </div>
            <div class="details-row">
              <span class="label">Date</span>
              <span class="value">${booking.date}</span>
            </div>
            <div class="details-row">
              <span class="label">Status</span>
              <span class="value"><span class="status-badge">${statusMap[booking.status] || booking.status}</span></span>
            </div>
            <div class="details-row">
              <span class="label">Booking ID</span>
              <span class="value" style="font-size: 12px; font-family: monospace;">${booking._id}</span>
            </div>
          </div>

          <p style="font-size: 14px;"><strong>📍 Important:</strong> Please arrive at the temple <strong>15 minutes</strong> before your scheduled time.</p>
          <p style="font-size: 14px;">For any changes or cancellations, please contact us at <strong>+977-1-4XXXXXX</strong>.</p>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:4000'}/mybookings" class="btn">View My Bookings</a>
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0;">🙏 Jai Shree Ram 🙏</p>
          <p style="margin: 6px 0 0;">
            <span class="temple-name">Shree Ramchandra Temple</span><br>
            Gaushala, Kathmandu, Nepal
          </p>
          <p style="margin: 10px 0 0; font-size: 11px; color: #aaa;">This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🕉 Puja Booking Confirmation - Shree Ramchandra Temple',
    html,
  });
};

/**
 * Send donation confirmation email
 * @param {Object} donation - Donation object
 * @param {Object} user - User object
 * @returns {Promise<Object>} Nodemailer response
 */
const sendDonationConfirmation = async (donation, user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Donation Confirmation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a2e;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #fafafa;
        }
        .container {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
          background: linear-gradient(135deg, #1F4E3D 0%, #16382C 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        .content {
          padding: 30px 25px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 12px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          border-top: 1px solid #e8e4e0;
          font-size: 13px;
          color: #8a8a9a;
          background: #fafafa;
        }
        .footer .temple-name {
          font-weight: 600;
          color: #1F4E3D;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🙏 Donation Confirmation</h1>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px;">Thank you for your generosity</p>
        </div>
        <div class="content">
          <p class="greeting">Dear <strong>${user.name}</strong>,</p>
          <p>Thank you for your generous donation to <strong>Shree Ramchandra Temple</strong>.</p>
          <p>Your contribution helps preserve this sacred place for generations to come and supports the temple's community services.</p>
          <p style="font-size: 16px; color: #1F4E3D; font-weight: 600; margin-top: 16px;">May Lord Ram bless you with peace, prosperity, and happiness.</p>
          <p style="margin-top: 16px;">Jai Shree Ram! 🙏</p>
        </div>
        <div class="footer">
          <p style="margin: 0;"><span class="temple-name">Shree Ramchandra Temple</span></p>
          <p style="margin: 4px 0 0;">Gaushala, Kathmandu, Nepal</p>
          <p style="margin: 10px 0 0; font-size: 11px; color: #aaa;">This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🙏 Donation Confirmation - Shree Ramchandra Temple',
    html,
  });
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} resetToken - Reset token
 * @param {string} frontendUrl - Frontend URL
 * @returns {Promise<Object>} Nodemailer response
 */
const sendPasswordResetEmail = async (user, resetToken, frontendUrl) => {
  const resetUrl = `${frontendUrl || process.env.FRONTEND_URL || 'http://localhost:4000'}/reset-password/${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a2e;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #fafafa;
        }
        .container {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
          background: linear-gradient(135deg, #7A1F2B 0%, #5B1420 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        .content {
          padding: 30px 25px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 12px;
        }
        .btn {
          display: inline-block;
          padding: 12px 30px;
          background: #7A1F2B;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 15px 0;
        }
        .btn:hover {
          background: #5B1420;
        }
        .warning {
          background: #FEF3C7;
          padding: 12px 16px;
          border-radius: 8px;
          margin: 12px 0;
          border-left: 4px solid #F59E0B;
        }
        .warning p {
          margin: 0;
          font-size: 14px;
          color: #92400E;
        }
        .footer {
          text-align: center;
          padding: 20px;
          border-top: 1px solid #e8e4e0;
          font-size: 13px;
          color: #8a8a9a;
          background: #fafafa;
        }
        .footer .temple-name {
          font-weight: 600;
          color: #7A1F2B;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p class="greeting">Dear <strong>${user.name}</strong>,</p>
          <p>You requested to reset your password for your Shree Ramchandra Temple account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </div>
          <div class="warning">
            <p>⚠️ <strong>This link expires in 30 minutes.</strong></p>
          </div>
          <p style="font-size: 14px; color: #6b6b7a;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          <p style="margin-top: 16px;">Jai Shree Ram! 🙏</p>
        </div>
        <div class="footer">
          <p style="margin: 0;"><span class="temple-name">Shree Ramchandra Temple</span></p>
          <p style="margin: 4px 0 0;">Gaushala, Kathmandu, Nepal</p>
          <p style="margin: 10px 0 0; font-size: 11px; color: #aaa;">This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🔐 Password Reset Request - Shree Ramchandra Temple',
    html,
  });
};

/**
 * Send welcome email to new user
 * @param {Object} user - User object
 * @returns {Promise<Object>} Nodemailer response
 */
const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Shree Ramchandra Temple</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a2e;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #fafafa;
        }
        .container {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
          background: linear-gradient(135deg, #7A1F2B 0%, #5B1420 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        .content {
          padding: 30px 25px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 12px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          border-top: 1px solid #e8e4e0;
          font-size: 13px;
          color: #8a8a9a;
          background: #fafafa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🕉 Welcome to Shree Ramchandra Temple</h1>
        </div>
        <div class="content">
          <p class="greeting">Dear <strong>${user.name}</strong>,</p>
          <p>Welcome to the Shree Ramchandra Temple community!</p>
          <p>We are delighted to have you as a member of our temple family. Through your account, you can:</p>
          <ul style="color: #4a4a5a;">
            <li>📅 Book pujas online</li>
            <li>🙏 Make donations</li>
            <li>📋 View your booking history</li>
            <li>📸 Explore our gallery</li>
          </ul>
          <p>We look forward to serving you and hope you find peace and blessings at our temple.</p>
          <p style="margin-top: 16px;">Jai Shree Ram! 🙏</p>
        </div>
        <div class="footer">
          <p style="margin: 0;"><strong>Shree Ramchandra Temple</strong></p>
          <p style="margin: 4px 0 0;">Gaushala, Kathmandu, Nepal</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🕉 Welcome to Shree Ramchandra Temple',
    html,
  });
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendDonationConfirmation,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  isEmailConfigured,
};