import asyncHandler from 'express-async-handler';
import Court from '../models/courtModel.js';
import Booking from '../models/bookingModel.js';
import BlockedSlot from '../models/blockedSlotModel.js';
import Venue from '../models/venueModel.js';
import { computeCourtAvailability, generateDayTimeSlots } from '../services/availabilityEngine.js';

// @desc    Get court availability matrix for a date and sport
// @route   GET /api/availability
// @access  Public
export const getAvailability = asyncHandler(async (req, res) => {
  const { date, sport, venueId: queryVenueId } = req.query;

  const targetDate = date || new Date().toISOString().split('T')[0];
  let venueId = req.user?.venueId || queryVenueId;

  // If no venueId specified, try to find the active venue default
  let venue = null;
  if (venueId) {
    venue = await Venue.findOne({ venueId, status: 'active' });
  } else {
    venue = await Venue.findOne({ status: 'active' });
    if (venue) {
      venueId = venue.venueId;
    }
  }

  const courtFilter = { isActive: true };
  if (venueId) {
    courtFilter.venueId = venueId;
  }
  if (sport && sport !== 'all') {
    courtFilter.sportType = sport.toLowerCase();
  }

  // Fetch active courts
  const courts = await Court.find(courtFilter).sort({ displayOrder: 1, name: 1 });

  if (courts.length === 0) {
    return res.json({
      success: true,
      date: targetDate,
      sport: sport || 'all',
      venue: venue
        ? {
            venueId: venue.venueId,
            name: venue.name,
            openingHour: venue.openingHour,
            closingHour: venue.closingHour,
            defaultSlotDuration: venue.defaultSlotDuration,
            currency: venue.currency,
            currencySymbol: venue.currencySymbol,
          }
        : null,
      timeHeaders: [],
      courts: [],
    });
  }

  // Fetch all bookings for this date across these courts
  const courtIds = courts.map((c) => c._id);
  const bookings = await Booking.find({
    court: { $in: courtIds },
    date: targetDate,
    status: { $ne: 'cancelled' },
  });

  // Fetch all blocked slots for this date
  const blockedSlots = await BlockedSlot.find({
    court: { $in: courtIds },
    date: targetDate,
  });

  // Check if admin is requesting (to include customer names or anonymize)
  const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'manager');

  const computedMatrix = computeCourtAvailability({
    courts,
    bookings,
    blockedSlots,
    date: targetDate,
    venue,
    includeBookingDetails: isAdmin,
  });

  // Generate standard unique time headers across all courts
  const defaultOpening = venue?.openingHour || '08:00';
  const defaultClosing = venue?.closingHour || '23:00';
  const defaultDuration = venue?.defaultSlotDuration || 60;

  const earliestOpening = courts.reduce((min, c) => (c.openingTime && c.openingTime < min ? c.openingTime : min), defaultOpening);
  const latestClosing = courts.reduce((max, c) => (c.closingTime && c.closingTime > max ? c.closingTime : max), defaultClosing);
  const timeHeaders = generateDayTimeSlots(earliestOpening, latestClosing, defaultDuration);

  // Summary counts
  const totalSlots = computedMatrix.reduce((acc, c) => acc + c.totalSlots, 0);
  const availableSlots = computedMatrix.reduce((acc, c) => acc + c.availableSlotsCount, 0);
  const bookedSlots = totalSlots - availableSlots;

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
          openingHour: venue.openingHour,
          closingHour: venue.closingHour,
          defaultSlotDuration: venue.defaultSlotDuration,
        }
      : null,
    summary: {
      totalCourts: courts.length,
      totalSlots,
      availableSlots,
      bookedSlots,
    },
    timeHeaders,
    courtsAvailability: computedMatrix,
  });
});
