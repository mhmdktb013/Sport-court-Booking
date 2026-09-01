import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema(
  {
    // Venue Identity
    venueId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      index: true,
    },
    subdomain: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    customDomain: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Branding & Visual Theme
    logoUrl: {
      type: String,
      default: '',
    },
    primaryColor: {
      type: String,
      default: '#10b981',
      validate: {
        validator: (v) => /^#[0-9A-Fa-f]{6}$/.test(v),
        message: 'Primary color must be a valid hex color',
      },
    },
    secondaryColor: {
      type: String,
      default: '#042f2e',
    },
    accentColor: {
      type: String,
      default: '#3b82f6',
    },
    darkMode: {
      type: Boolean,
      default: true,
    },

    // Location & Contact
    address: String,
    city: String,
    country: { type: String, default: 'Lebanon' },
    googleMapsLink: String,
    phone: String,
    whatsappNumber: String,
    instagramHandle: String,
    websiteUrl: String,

    // Operating Rules
    openingHour: { type: String, default: '08:00' },
    closingHour: { type: String, default: '23:00' },
    defaultSlotDuration: {
      type: Number,
      default: 60,
      enum: [30, 45, 60, 90, 120],
    },

    // Currency & Pricing
    currency: {
      type: String,
      enum: ['USD', 'LBP', 'EUR', 'AED'],
      default: 'USD',
    },
    currencySymbol: { type: String, default: '$' },
    exchangeRateToUSD: { type: Number, default: 1 },

    // Peak Pricing
    enablePeakPricing: { type: Boolean, default: false },
    peakPricingHours: [
      {
        startTime: String,
        endTime: String,
        priceMultiplier: Number,
      },
    ],

    // Subscription
    status: {
      type: String,
      enum: ['active', 'trial', 'suspended', 'inactive'],
      default: 'trial',
    },
    subscriptionPlan: {
      type: String,
      enum: ['starter', 'pro', 'enterprise'],
      default: 'starter',
    },
    subscriptionExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },

    // Settings
    allowOnlineBookings: { type: Boolean, default: true },
    sendWhatsAppNotifications: { type: Boolean, default: false },

    // Owner Info
    ownerEmail: { type: String, required: true, unique: true },
    ownerName: { type: String, required: true },
    ownerPhone: String,

    notes: String,
    isFeatureVenue: { type: Boolean, default: false },
  },
  { timestamps: true }
);

venueSchema.index({ status: 1, subscriptionExpiresAt: 1 });

const Venue = mongoose.model('Venue', venueSchema);
export default Venue;
