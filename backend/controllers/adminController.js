import asyncHandler from 'express-async-handler';
import Court from '../models/courtModel.js';
import Booking from '../models/bookingModel.js';
import BlockedSlot from '../models/blockedSlotModel.js';
import Venue from '../models/venueModel.js';
import notificationService from '../services/notificationService.js';
import { computeCourtAvailability, generateDayTimeSlots } from '../services/availabilityEngine.js';

// @desc    Get Admin Dashboard Stats & Metrics
// @route   GET /api/admin/metrics
// @access  Admin
export const getAdminMetrics = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const venueId = req.user?.venueId;

  const courtFilter = venueId ? { venueId } : {};
  const courts = await Court.find(courtFilter).select('_id');
  const courtIds = courts.map((c) => c._id);

  const totalCourts = courts.length;
  const activeCourts = await Court.countDocuments({ ...courtFilter, isActive: true });

  const bookingFilter = venueId ? { court: { $in: courtIds } } : {};
  const totalBookings = await Booking.countDocuments(bookingFilter);
  const todayBookings = await Booking.find({ ...bookingFilter, date: today, status: { $ne: 'cancelled' } });

  // Calculate revenue
  const allConfirmed = await Booking.find({ ...bookingFilter, status: { $in: ['confirmed', 'completed'] } });
  const totalRevenue = allConfirmed.reduce((acc, b) => acc + (b.price || 0), 0);
  const todayRevenue = todayBookings.reduce((acc, b) => acc + (b.price || 0), 0);

  // Recent 6 bookings
  const recentBookings = await Booking.find(bookingFilter)
    .sort({ createdAt: -1 })
    .limit(6)
    .populate('court', 'name sportType');

  res.json({
    success: true,
    metrics: {
      totalCourts,
      activeCourts,
      totalBookings,
      todayBookingsCount: todayBookings.length,
      todayRevenue,
      totalRevenue,
    },
    recentBookings,
  });
});

// @desc    Get all bookings with filters and search (Admin)
// @route   GET /api/admin/bookings
// @access  Admin
export const getAdminBookings = asyncHandler(async (req, res) => {
  const { search, sport, status, date, page = 1, limit = 50 } = req.query;
  const venueId = req.user?.venueId;

  const query = {};

  if (venueId) {
    const venueCourts = await Court.find({ venueId }).select('_id');
    const courtIds = venueCourts.map((c) => c._id);
    query.court = { $in: courtIds };
  }

  if (sport && sport !== 'all') {
    query.sportType = sport.toLowerCase();
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  if (date) {
    query.date = date;
  }

  if (search) {
    const s = search.trim();
    query.$or = [
      { customerName: { $regex: s, $options: 'i' } },
      { customerPhone: { $regex: s, $options: 'i' } },
      { bookingId: { $regex: s, $options: 'i' } },
      { courtName: { $regex: s, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Booking.countDocuments(query);
  const bookings = await Booking.find(query)
    .sort({ date: -1, startTime: -1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('court');

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    bookings,
  });
});

// @desc    Update booking status (e.g. completed, no-show, confirmed, cancelled)
// @route   PUT /api/admin/bookings/:id/status
// @access  Admin
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, cancellationReason } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const validStatuses = ['pending', 'confirmed', 'completed', 'no-show', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid booking status');
  }

  booking.status = status;
  if (cancellationReason) {
    booking.cancellationReason = cancellationReason;
  }

  await booking.save();

  if (status === 'cancelled') {
    await notificationService.onBookingCancelled(booking, cancellationReason);
  }

  res.json({ success: true, booking });
});

// @desc    Admin Calendar Matrix with full customer details
// @route   GET /api/admin/calendar
// @access  Admin
export const getAdminCalendar = asyncHandler(async (req, res) => {
  const { date, sport } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];
  const venueId = req.user?.venueId;

  const venue = venueId ? await Venue.findOne({ venueId }) : null;

  const courtFilter = {};
  if (venueId) {
    courtFilter.venueId = venueId;
  }
  if (sport && sport !== 'all') {
    courtFilter.sportType = sport.toLowerCase();
  }

  const courts = await Court.find(courtFilter).sort({ displayOrder: 1, name: 1 });
  const courtIds = courts.map((c) => c._id);

  const bookings = await Booking.find({
    court: { $in: courtIds },
    date: targetDate,
    status: { $ne: 'cancelled' },
  });

  const blockedSlots = await BlockedSlot.find({
    court: { $in: courtIds },
    date: targetDate,
  });

  const matrix = computeCourtAvailability({
    courts,
    bookings,
    blockedSlots,
    date: targetDate,
    venue,
    includeBookingDetails: true,
  });

  const defaultOpening = venue?.openingHour || '08:00';
  const defaultClosing = venue?.closingHour || '23:00';
  const defaultDuration = venue?.defaultSlotDuration || 60;

  const earliestOpening = courts.reduce((min, c) => (c.openingTime && c.openingTime < min ? c.openingTime : min), defaultOpening);
  const latestClosing = courts.reduce((max, c) => (c.closingTime && c.closingTime > max ? c.closingTime : max), defaultClosing);
  const timeHeaders = generateDayTimeSlots(earliestOpening, latestClosing, defaultDuration);

  res.json({
    success: true,
    date: targetDate,
    sport: sport || 'all',
    venue: venue
      ? {
          venueId: venue.venueId,
          name: venue.name,
          currency: venue.currency,
          currencySymbol: venue.currencySymbol,
        }
      : null,
    timeHeaders,
    matrix,
  });
});

// @desc    Block a specific time slot (Admin)
// @route   POST /api/admin/slots/block
// @access  Admin
export const blockSlot = asyncHandler(async (req, res) => {
  const { courtId, date, startTime, endTime, reason } = req.body;
  const venueId = req.user?.venueId;

  if (!courtId || !date || !startTime) {
    res.status(400);
    throw new Error('Court, date, and startTime are required to block a slot');
  }

  const court = await Court.findById(courtId);
  if (!court) {
    res.status(404);
    throw new Error('Court not found');
  }

  if (venueId && court.venueId !== venueId) {
    res.status(403);
    throw new Error('Cannot block slot: This court belongs to another venue');
  }

  // Check if slot has active booking
  const existingBooking = await Booking.findOne({
    court: courtId,
    date,
    startTime,
    status: { $ne: 'cancelled' },
  });

  if (existingBooking) {
    res.status(400);
    throw new Error(
      `Cannot block slot: A booking #${existingBooking.bookingId} (${existingBooking.customerName}) already exists on this time slot.`
    );
  }

  // Check if already blocked
  const alreadyBlocked = await BlockedSlot.findOne({
    court: courtId,
    date,
    startTime,
  });

  if (alreadyBlocked) {
    return res.json({ success: true, message: 'Slot is already blocked', blockedSlot: alreadyBlocked });
  }

  // Calculate default endTime if not given
  let computedEndTime = endTime;
  if (!computedEndTime) {
    const [sH, sM] = startTime.split(':').map(Number);
    const duration = court.slotDurationMinutes || 60;
    const totalMinutes = sH * 60 + sM + duration;
    computedEndTime = `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(
      totalMinutes % 60
    ).padStart(2, '0')}`;
  }

  const blockedSlot = await BlockedSlot.create({
    court: courtId,
    date,
    startTime,
    endTime: computedEndTime,
    reason: reason || 'Maintenance / Private Event',
    blockedBy: req.user ? req.user.name : 'Admin',
  });

  res.status(201).json({ success: true, message: 'Slot blocked successfully', blockedSlot });
});

// @desc    Unblock a previously blocked slot (Admin)
// @route   POST /api/admin/slots/unblock
// @access  Admin
export const unblockSlot = asyncHandler(async (req, res) => {
  const { courtId, date, startTime } = req.body;
  const venueId = req.user?.venueId;

  const court = await Court.findById(courtId);
  if (!court) {
    res.status(404);
    throw new Error('Court not found');
  }

  if (venueId && court.venueId !== venueId) {
    res.status(403);
    throw new Error('Cannot unblock slot: This court belongs to another venue');
  }

  const blocked = await BlockedSlot.findOneAndDelete({
    court: courtId,
    date,
    startTime,
  });

  if (!blocked) {
    res.status(404);
    throw new Error('Blocked slot record not found');
  }

  res.json({ success: true, message: 'Slot unblocked successfully' });
});
