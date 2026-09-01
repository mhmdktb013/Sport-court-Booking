import express from 'express';
import {
  getAdminMetrics,
  getAdminBookings,
  updateBookingStatus,
  getAdminCalendar,
  blockSlot,
  unblockSlot,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes are protected
router.use(protect, adminOnly);

router.route('/metrics').get(getAdminMetrics);
router.route('/bookings').get(getAdminBookings);
router.route('/bookings/:id/status').put(updateBookingStatus);
router.route('/calendar').get(getAdminCalendar);
router.route('/slots/block').post(blockSlot);
router.route('/slots/unblock').post(unblockSlot);

export default router;
