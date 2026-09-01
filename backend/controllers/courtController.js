import asyncHandler from 'express-async-handler';
import Court from '../models/courtModel.js';

const getTenantVenueId = (req) => {
  const requestedVenueId = req.query?.venueId || req.body?.venueId;
  if (req.user?.venueId) {
    return req.user.venueId;
  }
  return requestedVenueId || null;
};

// @desc    Get all active courts with optional sport filter
// @route   GET /api/courts
// @access  Public
export const getCourts = asyncHandler(async (req, res) => {
  const { sport, active } = req.query;
  const venueId = getTenantVenueId(req);
  const filter = {};

  if (venueId) {
    filter.venueId = venueId;
  }

  if (active !== 'all') {
    filter.isActive = true;
  }
  if (sport && sport !== 'all') {
    filter.sportType = sport.toLowerCase();
  }

  const courts = await Court.find(filter).sort({ displayOrder: 1, name: 1 });
  res.json({ success: true, count: courts.length, courts });
});

// @desc    Get featured courts for home page
// @route   GET /api/courts/featured
// @access  Public
export const getFeaturedCourts = asyncHandler(async (req, res) => {
  const venueId = getTenantVenueId(req);
  const filter = { isActive: true };

  if (venueId) {
    filter.venueId = venueId;
  }

  const courts = await Court.find(filter)
    .sort({ displayOrder: 1 })
    .limit(8);
  res.json({ success: true, count: courts.length, courts });
});

// @desc    Get single court by ID
// @route   GET /api/courts/:id
// @access  Public
export const getCourtById = asyncHandler(async (req, res) => {
  const venueId = getTenantVenueId(req);
  const filter = { _id: req.params.id };

  if (venueId) {
    filter.venueId = venueId;
  }

  const court = await Court.findOne(filter);
  if (!court) {
    res.status(404);
    throw new Error('Court not found');
  }
  res.json({ success: true, court });
});

// @desc    Create new court (Admin)
// @route   POST /api/courts
// @access  Admin
export const createCourt = asyncHandler(async (req, res) => {
  if (!req.user?.venueId) {
    res.status(401);
    throw new Error('User must belong to a venue to create courts');
  }

  const {
    name,
    sportType,
    description,
    surface,
    environment,
    features,
    images,
    pricePerHour,
    openingTime,
    closingTime,
    slotDurationMinutes,
    isActive,
    displayOrder,
  } = req.body;

  if (!name || !sportType || pricePerHour === undefined) {
    res.status(400);
    throw new Error('Please provide court name, sport type, and price per hour');
  }

  const court = await Court.create({
    venueId: req.user.venueId,
    name,
    sportType: sportType.toLowerCase(),
    description: description || '',
    surface: surface || 'Standard Turf',
    environment: environment || 'outdoor',
    features: features || ['Floodlights', 'Standard Sizing'],
    images: images || [],
    pricePerHour: Number(pricePerHour),
    openingTime: openingTime || '08:00',
    closingTime: closingTime || '23:00',
    slotDurationMinutes: Number(slotDurationMinutes) || 60,
    isActive: isActive !== undefined ? isActive : true,
    displayOrder: Number(displayOrder) || 0,
  });

  res.status(201).json({ success: true, court });
});

// @desc    Update court (Admin)
// @route   PUT /api/courts/:id
// @access  Admin
export const updateCourt = asyncHandler(async (req, res) => {
  const court = await Court.findById(req.params.id);
  if (!court) {
    res.status(404);
    throw new Error('Court not found');
  }

  if (req.user?.venueId && court.venueId !== req.user.venueId) {
    res.status(403);
    throw new Error('This court belongs to another venue');
  }

  Object.assign(court, req.body);
  if (req.body.sportType) {
    court.sportType = req.body.sportType.toLowerCase();
  }
  const updatedCourt = await court.save();
  res.json({ success: true, court: updatedCourt });
});

// @desc    Delete court (Admin)
// @route   DELETE /api/courts/:id
// @access  Admin
export const deleteCourt = asyncHandler(async (req, res) => {
  const court = await Court.findById(req.params.id);
  if (!court) {
    res.status(404);
    throw new Error('Court not found');
  }

  if (req.user?.venueId && court.venueId !== req.user.venueId) {
    res.status(403);
    throw new Error('This court belongs to another venue');
  }

  await court.deleteOne();
  res.json({ success: true, message: 'Court removed successfully' });
});
