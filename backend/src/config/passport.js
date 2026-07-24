const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback',
  scope: ['profile', 'email'],
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: profile.emails[0].value },
        { googleId: profile.id }
      ]
    });

    if (!user) {
      // Create new user
      user = new User({
        name: profile.displayName || profile.name?.givenName || 'Google User',
        email: profile.emails[0].value,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Random password
        phone: '',
        address: '',
        profilePhoto: profile.photos?.[0]?.value || null,
        googleId: profile.id,
        role: 'user',
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = profile.id;
      if (!user.profilePhoto && profile.photos?.[0]?.value) {
        user.profilePhoto = profile.photos[0].value;
      }
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    console.error('Google Strategy Error:', error);
    return done(error, null);
  }
}));

module.exports = passport;