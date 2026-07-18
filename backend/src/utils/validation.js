const validator = require('validator');

/**
 * Validate email
 */
const validateEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Validate phone number (Nepal format)
 */
const validatePhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

/**
 * Validate password strength
 */
const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate URL
 */
const validateUrl = (url) => {
  return validator.isURL(url);
};

/**
 * Validate YouTube URL
 */
const validateYoutubeUrl = (url) => {
  if (!url) return true; // Optional
  const pattern = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/;
  return pattern.test(url);
};

/**
 * Get YouTube video ID from URL
 */
const getYoutubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : null;
};

/**
 * Validate date format (YYYY-MM-DD)
 */
const validateDate = (date) => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

/**
 * Sanitize input string
 */
const sanitizeString = (str) => {
  if (!str) return '';
  return validator.escape(str.trim());
};

/**
 * Validate booking data
 */
const validateBooking = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  
  if (!data.phone || !validatePhone(data.phone)) {
    errors.push('Valid phone number is required (10 digits)');
  }
  
  if (!data.date || !validateDate(data.date)) {
    errors.push('Valid date is required (YYYY-MM-DD)');
  }
  
  if (!data.type || data.type.trim().length < 2) {
    errors.push('Puja type is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate user registration data
 */
const validateUserRegistration = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.password || !validatePassword(data.password)) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (!data.phone || !validatePhone(data.phone)) {
    errors.push('Valid phone number is required (10 digits)');
  }
  
  if (!data.address || data.address.trim().length < 2) {
    errors.push('Address is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate contact form
 */
const validateContact = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name is required');
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  validateUrl,
  validateYoutubeUrl,
  getYoutubeId,
  validateDate,
  sanitizeString,
  validateBooking,
  validateUserRegistration,
  validateContact,
};