import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Otp from '../models/otpModel.js';
import notificationService from '../services/notificationService.js';
import { JWT_SECRET, OTP_ENFORCED } from '../config/env.js';

const MAX_OTP_ATTEMPTS = 5;

const generateToken = (id, venueId, role) => {
  return jwt.sign({ id, venueId, role }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token (Admin / Manager)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        venueId: user.venueId,
      },
      token: generateToken(user._id, user.venueId, user.role),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Send OTP to phone number
// @route   POST /api/auth/otp/send
// @access  Public
export const sendPhoneOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone || phone.trim().length < 6) {
    res.status(400);
    throw new Error('A valid phone number is required');
  }

  if (!OTP_ENFORCED) {
    return res.json({
      success: true,
      enforced: false,
      message: 'Phone verification is not required at this time',
    });
  }

  const cleanPhone = phone.trim();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.deleteMany({ phone: cleanPhone });

  await Otp.create({
    phone: cleanPhone,
    code,
    expiresAt,
  });

  await notificationService.sendOtp(cleanPhone, code);

  res.json({
    success: true,
    enforced: true,
    message: 'Verification code sent to your phone',
  });
});

// @desc    Verify OTP
// @route   POST /api/auth/otp/verify
// @access  Public
export const verifyPhoneOtp = asyncHandler(async (req, res) => {
  const { phone, code } = req.body;

  if (!OTP_ENFORCED) {
    return res.json({
      success: true,
      enforced: false,
      verified: false,
      message: 'Phone verification is not required at this time',
    });
  }

  if (!phone || !code) {
    res.status(400);
    throw new Error('Phone number and code are required');
  }

  const cleanPhone = phone.trim();

  const otpRecord = await Otp.findOne({
    phone: cleanPhone,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    res.status(400);
    throw new Error('Invalid or expired verification code');
  }

  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    await otpRecord.deleteOne();
    res.status(429);
    throw new Error('Too many incorrect attempts. Please request a new code.');
  }

  if (otpRecord.code !== code.trim()) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    res.status(400);
    throw new Error('Invalid or expired verification code');
  }

  otpRecord.verified = true;
  await otpRecord.save();

  res.json({
    success: true,
    enforced: true,
    verified: true,
    message: 'Phone number verified successfully',
  });
});
