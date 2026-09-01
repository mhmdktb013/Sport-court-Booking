import express from 'express';
import {
  loginUser,
  getUserProfile,
  sendPhoneOtp,
  verifyPhoneOtp,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/otp/send', sendPhoneOtp);
router.post('/otp/verify', verifyPhoneOtp);

export default router;
