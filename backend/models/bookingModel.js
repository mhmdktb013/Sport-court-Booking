import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    // Unique slot lock key for active bookings: "${courtId}_${date}_${startTime}"
    // Cleared/set null when cancelled so that the slot can be booked again
    slotLockKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    venueId: {
      type: String,
      required: [true, 'Venue ID is required'],
      index: true,
    },
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Court',
      required: [true, 'Court reference is required'],
      index: true,
    },
    courtName: {
      type: String,
      required: true,
    },
    sportType: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: [true, 'Booking date is required'],
      index: true,
    },
    startTime: {
      type: String, // HH:mm
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String, // HH:mm
      required: [true, 'End time is required'],
    },
    duration: {
      type: Number, // in minutes (e.g. 60, 90, 120)
      default: 60,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
      index: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
      default: 'confirmed',
      index: true,
    },
    createdBy: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    isPhoneVerified: {
      type: Boolean,
      default: true,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for slot lookup and fast queries
bookingSchema.index({ venueId: 1, date: 1 });
bookingSchema.index({ court: 1, date: 1, startTime: 1, status: 1 });
bookingSchema.index({ date: 1, sportType: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
