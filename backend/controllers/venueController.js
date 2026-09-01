import asyncHandler from '../middleware/asyncHandler.js';
import Venue from '../models/venueModel.js';
import { v4 as uuidv4 } from 'uuid';

// Helper to format public venue payload
const formatPublicVenue = (venue) => {
  if (!venue) return null;
  return {
    venueId: venue.venueId,
    name: venue.name,
    slug: venue.slug,
    subdomain: venue.subdomain,
    customDomain: venue.customDomain,
    logoUrl: venue.logoUrl,
    primaryColor: venue.primaryColor,
    secondaryColor: venue.secondaryColor,
    accentColor: venue.accentColor,
    address: venue.address,
    city: venue.city,
    country: venue.country,
    phone: venue.phone,
    whatsappNumber: venue.whatsappNumber,
    instagramHandle: venue.instagramHandle,
    websiteUrl: venue.websiteUrl,
    currency: venue.currency,
    currencySymbol: venue.currencySymbol,
    openingHour: venue.openingHour,
    closingHour: venue.closingHour,
    defaultSlotDuration: venue.defaultSlotDuration,
    enablePeakPricing: venue.enablePeakPricing,
    peakPricingHours: venue.peakPricingHours,
  };
};

// @desc    Resolve venue by custom domain, subdomain, slug, or default active (Chocair Arena)
// @route   GET /api/venues/resolve
// @access  Public
export const resolveVenue = asyncHandler(async (req, res) => {
  const { host, slug, venueId, subdomain } = req.query;
  const headerHost = req.headers.host ? req.headers.host.split(':')[0].toLowerCase() : '';
  const headerVenueSlug = req.headers['x-venue-slug'];
  const headerVenueId = req.headers['x-venue-id'];

  let venue = null;

  // PRIORITY 1: Custom domain or hostname match
  const checkHost = (host || headerHost).toLowerCase();
  if (checkHost && checkHost !== 'localhost' && checkHost !== '127.0.0.1') {
    // Check exact custom domain
    venue = await Venue.findOne({ customDomain: checkHost, status: { $ne: 'inactive' } });

    // Check subdomain pattern (e.g. "chocair.domain.com" or "beirut-hub.domain.com")
    if (!venue && checkHost.includes('.')) {
      const parts = checkHost.split('.');
      const sub = parts[0];
      if (sub && sub !== 'www' && sub !== 'app' && !parts.includes('vercel') && !parts.includes('onrender')) {
        venue = await Venue.findOne({
          $or: [{ subdomain: sub }, { slug: sub }],
          status: { $ne: 'inactive' },
        });
      }
    }
  }

  // PRIORITY 2: Dedicated Subdomain parameter
  const targetSubdomain = subdomain;
  if (!venue && targetSubdomain) {
    venue = await Venue.findOne({ subdomain: targetSubdomain.toLowerCase().trim(), status: { $ne: 'inactive' } });
  }

  // PRIORITY 3: Explicit ?venue=slug (URL query parameter ALWAYS takes precedence over default)
  const targetSlug = slug || headerVenueSlug;
  if (!venue && targetSlug) {
    const cleanSlug = targetSlug.toLowerCase().trim();
    venue = await Venue.findOne({ slug: cleanSlug, status: { $ne: 'inactive' } });
    if (!venue) {
      venue = await Venue.findOne({ subdomain: cleanSlug, status: { $ne: 'inactive' } });
    }
  }

  // Explicit venueId parameter
  const targetVenueId = venueId || headerVenueId;
  if (!venue && targetVenueId) {
    venue = await Venue.findOne({ venueId: targetVenueId, status: { $ne: 'inactive' } });
  }

  // PRIORITY 4: DEFAULT FALLBACK — ALWAYS CHOCAIR ARENA
  if (!venue) {
    venue = await Venue.findOne({ slug: 'chocair-arena', status: { $ne: 'inactive' } });
  }
  if (!venue) {
    venue = await Venue.findOne({ name: { $regex: /chocair/i }, status: { $ne: 'inactive' } });
  }
  if (!venue) {
    venue = await Venue.findOne({ isFeatureVenue: true, status: 'active' });
  }
  if (!venue) {
    venue = await Venue.findOne({ status: 'active' });
  }

  if (!venue) {
    return res.status(200).json({
      success: true,
      venue: null,
    });
  }

  res.status(200).json({
    success: true,
    venue: formatPublicVenue(venue),
  });
});

// @desc    Get active venue info (public endpoint for initial app branding load — defaults to Chocair Arena)
// @route   GET /api/venues/active
// @access  Public
export const getActiveVenue = asyncHandler(async (req, res) => {
  let venue = await Venue.findOne({ slug: 'chocair-arena', status: { $ne: 'inactive' } });
  if (!venue) {
    venue = await Venue.findOne({ name: { $regex: /chocair/i }, status: { $ne: 'inactive' } });
  }
  if (!venue) {
    venue = await Venue.findOne({ isFeatureVenue: true, status: 'active' });
  }
  if (!venue) {
    venue = await Venue.findOne({ status: 'active' });
  }

  if (!venue) {
    return res.status(200).json({
      success: true,
      venue: null,
    });
  }

  res.status(200).json({
    success: true,
    venue: formatPublicVenue(venue),
  });
});

// @desc    Get venue by slug (public endpoint for branding)
// @route   GET /api/venues/:slug
// @access  Public
export const getVenueBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const venue = await Venue.findOne({ slug: slug.toLowerCase(), status: 'active' });

  if (!venue) {
    res.status(404);
    throw new Error('Venue not found or inactive');
  }

  res.status(200).json({
    success: true,
    venue: formatPublicVenue(venue),
  });
});

// @desc    Get current venue settings (admin access)
// @route   GET /api/admin/venue/settings
// @access  Admin
export const getVenueSettings = asyncHandler(async (req, res) => {
  const venueId = req.user?.venueId;
  if (!venueId) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const venue = await Venue.findOne({ venueId });
  if (!venue) {
    res.status(404);
    throw new Error('Venue not found');
  }

  res.status(200).json({
    success: true,
    venue,
  });
});

// @desc    Update venue branding and settings
// @route   PUT /api/admin/venue/settings
// @access  Admin
export const updateVenueSettings = asyncHandler(async (req, res) => {
  const venueId = req.user?.venueId;
  if (!venueId) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const {
    name,
    slug,
    subdomain,
    customDomain,
    logoUrl,
    primaryColor,
    secondaryColor,
    accentColor,
    address,
    city,
    country,
    phone,
    whatsappNumber,
    instagramHandle,
    websiteUrl,
    openingHour,
    closingHour,
    defaultSlotDuration,
    currency,
    currencySymbol,
    exchangeRateToUSD,
    enablePeakPricing,
    peakPricingHours,
    sendWhatsAppNotifications,
  } = req.body;

  const updateFields = {
    name,
    logoUrl,
    primaryColor,
    secondaryColor,
    accentColor,
    address,
    city,
    country,
    phone,
    whatsappNumber,
    instagramHandle,
    websiteUrl,
    openingHour,
    closingHour,
    defaultSlotDuration,
    currency,
    currencySymbol,
    exchangeRateToUSD,
    enablePeakPricing,
    peakPricingHours,
    sendWhatsAppNotifications,
  };

  if (slug) updateFields.slug = slug.toLowerCase().trim();
  if (subdomain !== undefined) updateFields.subdomain = subdomain ? subdomain.toLowerCase().trim() : null;
  if (customDomain !== undefined) updateFields.customDomain = customDomain ? customDomain.toLowerCase().trim() : null;

  const venue = await Venue.findOneAndUpdate(
    { venueId },
    updateFields,
    { new: true, runValidators: true }
  );

  if (!venue) {
    res.status(404);
    throw new Error('Venue not found');
  }

  res.status(200).json({
    success: true,
    message: 'Venue settings updated successfully',
    venue,
  });
});

// @desc    Create new venue (super admin only)
// @route   POST /api/venues
// @access  SuperAdmin
export const createVenue = asyncHandler(async (req, res) => {
  const { name, slug, ownerEmail, ownerName, ownerPhone, subscriptionPlan } =
    req.body;

  if (!req.user || req.user.role !== 'super_admin') {
    res.status(403);
    throw new Error('Only super admin can create venues');
  }

  const venueId = uuidv4();

  const venue = await Venue.create({
    venueId,
    name,
    slug,
    ownerEmail,
    ownerName,
    ownerPhone,
    subscriptionPlan: subscriptionPlan || 'starter',
    status: 'active',
  });

  res.status(201).json({
    success: true,
    message: 'Venue created successfully',
    venue,
  });
});

// @desc    Get all venues (super admin only)
// @route   GET /api/venues
// @access  SuperAdmin
export const getAllVenues = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'super_admin') {
    res.status(403);
    throw new Error('Only super admin can view all venues');
  }

  const venues = await Venue.find({}).select('-peakPricingHours');

  res.status(200).json({
    success: true,
    count: venues.length,
    venues,
  });
});

// @desc    Delete venue (super admin only)
// @route   DELETE /api/venues/:venueId
// @access  SuperAdmin
export const deleteVenue = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'super_admin') {
    res.status(403);
    throw new Error('Only super admin can delete venues');
  }

  const { venueId } = req.params;
  const venue = await Venue.findOneAndDelete({ venueId });

  if (!venue) {
    res.status(404);
    throw new Error('Venue not found');
  }

  res.status(200).json({
    success: true,
    message: 'Venue deleted successfully',
  });
});
