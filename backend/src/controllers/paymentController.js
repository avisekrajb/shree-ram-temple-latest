const crypto = require('crypto');
const Donation = require('../models/Donation');
const AdminSettings = require('../models/AdminSettings');
const User = require('../models/User');
const { sendDonationConfirmation } = require('../services/emailService');

// @desc    Initiate eSewa payment
// @route   POST /api/payment/esewa/initiate
// @access  Private
exports.initiateEsewaPayment = async (req, res) => {
  try {
    const { amount, name, email, phone } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Use test merchant ID
    const merchantId = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
    const secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
    const testMode = process.env.ESEWA_MODE !== 'live';
    const successUrl = process.env.ESEWA_SUCCESS_URL || 'http://localhost:4000/donate/success';
    const failureUrl = process.env.ESEWA_FAILURE_URL || 'http://localhost:4000/donate/failure';

    // Generate unique transaction ID
    const transactionUuid = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // Create donation record
    const donation = await Donation.create({
      userId: req.user.id,
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      amount: Number(amount),
      transactionId: transactionUuid,
      status: 'pending',
      paymentMethod: 'esewa',
    });

    // For eSewa, we need to send as form data
    const formData = {
      amount: amount.toString(),
      transaction_uuid: transactionUuid,
      product_code: merchantId,
      product_service_charge: '0',
      product_delivery_charge: '0',
      tax_amount: '0',
      total_amount: amount.toString(),
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
    };

    // Generate signature
    const signatureString = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${merchantId}`;
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(signatureString)
      .digest('base64');

    formData.signature = signature;

    // Return eSewa payment data
    res.json({
      success: true,
      data: formData,
      url: testMode ? process.env.ESEWA_TEST_URL : process.env.ESEWA_LIVE_URL,
      donationId: donation._id,
    });

  } catch (error) {
    console.error('Initiate eSewa payment error:', error);
    res.status(500).json({ message: 'Payment initiation failed: ' + error.message });
  }
};

// @desc    Verify eSewa payment status
// @route   POST /api/payment/esewa/verify
// @access  Private
exports.verifyEsewaPayment = async (req, res) => {
  try {
    const { transaction_uuid, product_code, total_amount, status, donationId } = req.body;

    // Find donation
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check if payment was successful
    const isSuccess = status === 'success' || status === 'COMPLETE' || status === 'completed';

    if (isSuccess) {
      donation.status = 'completed';
      donation.transactionId = transaction_uuid;
      await donation.save();

      // Update settings count
      const settings = await AdminSettings.getSettings();
      settings.donate.baseCount += 1;
      await settings.save();

      // Send confirmation email
      try {
        const user = await User.findById(donation.userId);
        if (user) {
          await sendDonationConfirmation(donation, user);
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        donationId,
      });
    } else {
      donation.status = 'failed';
      await donation.save();
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

  } catch (error) {
    console.error('Verify eSewa payment error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

// @desc    Check donation status
// @route   GET /api/payment/status/:donationId
// @access  Private
exports.getDonationStatus = async (req, res) => {
  try {
    const { donationId } = req.params;
    const donation = await Donation.findById(donationId);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json({
      success: true,
      data: donation,
    });
  } catch (error) {
    console.error('Get donation status error:', error);
    res.status(500).json({ message: 'Failed to get donation status' });
  }
};