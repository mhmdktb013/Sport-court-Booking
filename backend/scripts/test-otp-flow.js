import mongoose from 'mongoose';
import '../config/env.js';
import Otp from '../models/otpModel.js';

const BASE = 'http://localhost:5005/api';

const post = (path, body) =>
  fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(async (r) => ({ status: r.status, data: await r.json() }));

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const phone = '+961 70 777 111';

  const sent = await post('/auth/otp/send', { phone });
  console.log('1) send response leaks a code?', 'devCode' in sent.data || 'code' in sent.data);

  const record = await Otp.findOne({ phone });
  const verified = await post('/auth/otp/verify', { phone, code: record.code });
  console.log('2) verify with real code:', verified.status, JSON.stringify(verified.data));

  const today = new Date().toISOString().split('T')[0];
  const availability = await fetch(`${BASE}/availability?date=${today}`).then((r) => r.json());
  const court = availability.courtsAvailability[0];
  const slot = court.slots.find((s) => s.status === 'available');

  const booking = await post('/bookings', {
    courtId: court.court._id,
    date: today,
    startTime: slot.startTime,
    endTime: slot.endTime,
    customerName: 'Verified Player',
    customerPhone: phone,
  });
  console.log(
    '3) booking after verification:',
    booking.status,
    booking.data.booking?.bookingId,
    '| isPhoneVerified:',
    booking.data.booking?.isPhoneVerified
  );

  await mongoose.disconnect();
  process.exit(0);
})();
