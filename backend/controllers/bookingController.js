import asyncHandler from 'express-async-handler';
import Booking from '../models/bookingModel.js';
import Court from '../models/courtModel.js';
import BlockedSlot from '../models/blockedSlotModel.js';
import Venue from '../models/venueModel.js';
import notificationService from '../services/notificationService.js';
import { isSlotInPast, calculateSlotPrice } from '../services/availabilityEngine.js';

// Helper to generate a unique readable booking ID (e.g. SZ-84920)
const generateBookingCode = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = 'SZ-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// @desc    Create new booking with atomic double-booking prevention
// @route   POST /api/bookings
// @access  Public / Customer
export const createBooking = asyncHandler(async (req, res) => {
  const {
    courtId,
    date,
    startTime,
    endTime,
    customerName,
    customerPhone,
    customerEmail,
    notes,
  } = req.body;

  // Basic validation
  if (!courtId || !date || !startTime || !customerName || !customerPhone) {
    res.status(400);
    throw new Error('Please provide court, date, start time, customer name, and phone number');
  }

  // Verify Court exists and is active
  const court = await Court.findById(courtId);
  if (!court || !court.isActive) {
    res.status(404);
    throw new Error('Selected court does not exist or is currently inactive');
  }

  // Calculate default endTime if not provided
  let computedEndTime = endTime;
  const duration = court.slotDurationMinutes || 60;
  if (!computedEndTime) {
    const [sH, sM] = startTime.split(':').map(Number);
    const totalMinutes = sH * 60 + sM + duration;
    const eH = Math.floor(totalMinutes / 60);
    const eM = totalMinutes % 60;
    computedEndTime = `${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}`;
  }

  // Prevent booking past slots for today
  if (isSlotInPast(date, startTime)) {
    res.status(400);
    throw new Error('Cannot book a time slot in the past. Please select an upcoming slot.');
  }

  // 1. Check if slot is blocked by Admin
  const isBlocked = await BlockedSlot.findOne({
    court: courtId,
    date,
    startTime,
  });

  if (isBlocked) {
    res.status(409);
    throw new Error(
      `This slot is currently blocked (${isBlocked.reason || 'Maintenance'}). Please choose another slot.`
    );
  }

  // 2. Concurrency Check: Check if an active booking already exists for this exact court, date & time
  const existingBooking = await Booking.findOne({
    court: courtId,
    date,
    startTime,
    status: { $in: ['confirmed', 'pending'] },
  });

  if (existingBooking) {
    res.status(409);
    throw new Error(
      'Slot unavailable: This time slot was just booked by another player. Please select a different time.'
    );
  }

  // 3. Create unique booking code
  let bookingId = generateBookingCode();
  let codeExists = await Booking.findOne({ bookingId });
  while (codeExists) {
    bookingId = generateBookingCode();
    codeExists = await Booking.findOne({ bookingId });
  }

  // 4. Calculate total price and atomic lock key
  const venue = await Venue.findOne({ venueId: court.venueId });
  const price = calculateSlotPrice(court.pricePerHour, duration, startTime, venue);
  const slotLockKey = `${courtId}_${date}_${startTime}`;

  // 5. Create booking record with atomic database constraint
  let booking;
  try {
    booking = await Booking.create({
      bookingId,
      slotLockKey,
      venueId: court.venueId,
      court: court._id,
      courtName: court.name,
      sportType: court.sportType,
      date,
      startTime,
      endTime: computedEndTime,
      duration,
      price,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : '',
      notes: notes || '',
      status: 'confirmed',
      createdBy: req.user && req.user.role === 'admin' ? 'admin' : 'customer',
      isPhoneVerified: true,
    });
  } catch (createErr) {
    if (createErr.code === 11000) {
      res.status(409);
      throw new Error('Slot unavailable: This time slot was just booked by another player.');
    }
    throw createErr;
  }

  // 6. Trigger notification hook (prepared for WhatsApp in final phase)
  await notificationService.onBookingConfirmed(booking);

  res.status(201).json({
    success: true,
    message: 'Booking confirmed successfully!',
    booking,
  });
});

// @desc    Get booking details by ID or booking reference code
// @route   GET /api/bookings/:idOrCode
// @access  Public
export const getBookingDetails = asyncHandler(async (req, res) => {
  const { idOrCode } = req.params;

  let booking;
  if (idOrCode.startsWith('SZ-')) {
    booking = await Booking.findOne({ bookingId: idOrCode }).populate('court');
  } else {
    booking = await Booking.findById(idOrCode).populate('court');
  }

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  res.json({ success: true, booking });
});

// @desc    Cancel a booking
// @route   POST /api/bookings/:id/cancel
// @access  Public / Customer or Admin
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  let booking = await Booking.findById(id);
  if (!booking && id.startsWith('SZ-')) {
    booking = await Booking.findOne({ bookingId: id });
  }

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.status === 'cancelled') {
    return res.json({ success: true, message: 'Booking is already cancelled', booking });
  }

  booking.status = 'cancelled';
  booking.slotLockKey = undefined; // Clear atomic lock key so slot frees up
  booking.cancellationReason = reason || 'Cancelled by user';
  await booking.save();

  // Trigger notification hook
  await notificationService.onBookingCancelled(booking, reason);

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    booking,
  });
});

// @desc    Lookup bookings by phone number
// @route   GET /api/bookings/lookup/phone
// @access  Public
export const lookupBookingsByPhone = asyncHandler(async (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    res.status(400);
    throw new Error('Phone number is required');
  }

  const cleanPhone = phone.trim();
  const bookings = await Booking.find({
    customerPhone: { $regex: cleanPhone, $options: 'i' },
  })
    .populate('court')
    .sort({ date: -1, startTime: -1 })
    .limit(20);

  res.json({ success: true, count: bookings.length, bookings });
});
