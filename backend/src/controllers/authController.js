const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { 
  sendEmail, 
  sendOtpEmail, 
  sendPasswordResetEmail, 
  sendWelcomeEmail,
  sendGoogleWelcomeEmail,
  sendBookingConfirmation,
  sendDonationConfirmation,
  sendTeamWelcomeEmail 
} = require('../services/emailService');
const passport = require('passport');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
    });

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    // Send welcome email
    try {
      await sendWelcomeEmail(user);
      console.log(`✅ Welcome email sent to ${user.email}`);
    } catch (emailError) {
      console.error('❌ Welcome email error:', emailError.message);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Forgot password (send reset link)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user, resetToken, process.env.FRONTEND_URL);
      console.log(`✅ Password reset email sent to ${user.email}`);
    } catch (emailError) {
      console.error('❌ Password reset email error:', emailError.message);
      return res.status(500).json({ message: 'Failed to send reset email' });
    }

    res.json({ 
      success: true, 
      message: 'Password reset email sent' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset password (with token)
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Password reset successfully' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============================================
// OTP Password Reset
// ============================================

// @desc    Send OTP for password reset
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' });
    }

    // Generate OTP (4 digits)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Store OTP in user document (with expiry)
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(otp + process.env.JWT_SECRET)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP via email
    try {
      await sendOtpEmail(user, otp);
      console.log(`✅ OTP email sent to ${user.email}`);
    } catch (emailError) {
      console.error('❌ OTP email error:', emailError.message);
      // Clear the reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({ 
      success: true, 
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const hashedOtp = crypto
      .createHash('sha256')
      .update(otp + process.env.JWT_SECRET)
      .digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedOtp,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Generate temporary reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    res.json({
      success: true,
      resetToken,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password-otp
// @access  Public
exports.resetPasswordOtp = async (req, res) => {
  try {
    const { resetToken, password } = req.body;
    
    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password OTP error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

// ============================================
// Google OAuth
// ============================================

// @desc    Google OAuth
// @route   GET /api/auth/google
// @access  Public
exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account',
});

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/?error=google_auth_failed`,
    session: true,
  }, (err, user, info) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/?error=google_auth_failed`);
    }
    
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.redirect(`${process.env.FRONTEND_URL}/?error=google_auth_failed`);
      }
      
      // Generate JWT token for API access
      const token = generateToken(user._id);
      
      // Redirect to frontend with token
      return res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role,
        isGoogleUser: true,
      }))}`);
    });
  })(req, res, next);
};

// @desc    Google login (for mobile/SPA)
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    const { googleId, email, name, profilePhoto } = req.body;
    
    if (!email || !googleId) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and Google ID are required' 
      });
    }

    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    if (!user) {
      // Create new Google user
      user = new User({
        name: name || email.split('@')[0] || 'Google User',
        email: email,
        googleId: googleId,
        profilePhoto: profilePhoto || null,
        phone: '',
        address: '',
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8),
        role: 'user',
        isGoogleUser: true,
      });
      await user.save();
      
      // Send welcome email for Google user
      try {
        await sendGoogleWelcomeEmail(user);
        console.log(`✅ Welcome email sent to Google user ${user.email}`);
      } catch (emailError) {
        console.error('❌ Google welcome email error:', emailError.message);
        // Don't fail the request if email fails
      }
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleId;
      user.isGoogleUser = true;
      if (!user.profilePhoto && profilePhoto) {
        user.profilePhoto = profilePhoto;
      }
      await user.save();
      
      // Send notification that Google account was linked
      try {
        await sendEmail({
          to: user.email,
          subject: '🔗 Google Account Linked - Shree Ramchandra Temple',
          html: `
            <h2>Google Account Linked</h2>
            <p>Dear ${user.name},</p>
            <p>Your Google account has been successfully linked to your Shree Ramchandra Temple account.</p>
            <p>You can now sign in using Google.</p>
            <p>Jai Shree Ram! 🙏</p>
          `,
        });
      } catch (emailError) {
        console.error('Link notification email error:', emailError.message);
      }
    }

    const token = generateToken(user._id);
    user.password = undefined;

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Server error during Google login' 
    });
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    req.session.destroy(() => {
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });
};