import mongoose from 'mongoose';

const blockedSlotSchema = new mongoose.Schema(
  {
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Court',
      required: true,
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    startTime: {
      type: String, // HH:mm
      required: true,
    },
    endTime: {
      type: String, // HH:mm
      required: true,
    },
    reason: {
      type: String,
      default: 'Maintenance / Blocked by Admin',
    },
    blockedBy: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

blockedSlotSchema.index({ court: 1, date: 1, startTime: 1 }, { unique: true });

const BlockedSlot = mongoose.model('BlockedSlot', blockedSlotSchema);
export default BlockedSlot;
