import express from 'express';
import {
  createBooking,
  getBookingDetails,
  cancelBooking,
  lookupBookingsByPhone,
} from '../controllers/bookingController.js';

const router = express.Router();

router.route('/').post(createBooking);
router.route('/lookup/phone').get(lookupBookingsByPhone);
router.route('/:idOrCode').get(getBookingDetails);
router.route('/:id/cancel').post(cancelBooking);

export default router;
