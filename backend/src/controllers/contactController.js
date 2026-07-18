const { sendEmail } = require('../services/emailService');
const { validateContact } = require('../utils/validation');

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    const validation = validateContact({ name, email, message });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    // Send email to admin
    const html = `
      <h2>📬 New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</p>
      <p style="font-size: 12px; color: #888;">Sent from Shree Ramchandra Temple website</p>
    `;

    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `Contact Message from ${name}`,
      html,
    });

    // Send auto-reply to user
    const autoReplyHtml = `
      <h2>🙏 Thank You for Contacting Us</h2>
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to Shree Ramchandra Temple. We have received your message and will get back to you as soon as possible.</p>
      <p><strong>Your Message:</strong></p>
      <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</p>
      <p>Jai Shree Ram! 🙏</p>
      <p style="font-size: 12px; color: #888;">Shree Ramchandra Temple, Gaushala, Kathmandu</p>
    `;

    try {
      await sendEmail({
        to: email,
        subject: 'We Received Your Message - Shree Ramchandra Temple',
        html: autoReplyHtml,
      });
    } catch (emailError) {
      console.error('Auto-reply email error:', emailError);
      // Don't fail the request if auto-reply fails
    }

    res.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// @desc    Get contact messages (admin only)
// @route   GET /api/contact/messages
// @access  Private/Admin
exports.getContactMessages = async (req, res) => {
  try {
    // This would typically store messages in a database
    // For now, we'll just return a success message
    res.json({
      success: true,
      message: 'Contact messages feature coming soon',
      data: [],
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};