import mongoose from 'mongoose';

const courtSchema = new mongoose.Schema(
  {
    venueId: {
      type: String,
      required: [true, 'Venue ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Court name is required'],
      trim: true,
    },
    sportType: {
      type: String,
      required: [true, 'Sport type is required'],
      enum: ['football', 'padel', 'tennis', 'basketball', 'badminton', 'volleyball'],
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    surface: {
      type: String,
      default: 'Standard Turf',
    },
    environment: {
      type: String,
      enum: ['indoor', 'outdoor', 'covered'],
      default: 'outdoor',
    },
    features: {
      type: [String],
      default: ['Floodlights', 'Standard Sizing', 'Free Parking'],
    },
    images: {
      type: [String],
      default: [],
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: 0,
    },
    openingTime: {
      type: String,
      default: '08:00', // HH:mm
    },
    closingTime: {
      type: String,
      default: '23:00', // HH:mm
    },
    slotDurationMinutes: {
      type: Number,
      default: 60,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient venue-based queries
courtSchema.index({ venueId: 1, sportType: 1 });
courtSchema.index({ venueId: 1, isActive: 1 });

const Court = mongoose.model('Court', courtSchema);
export default Court;
