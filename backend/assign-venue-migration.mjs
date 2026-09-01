import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/userModel.js';
import Court from './models/courtModel.js';

dotenv.config();
const venueId = '63c0ffd3-4d4c-4745-b12a-bc2a1c8e7836';

try {
  await mongoose.connect(process.env.MONGO_URI);

  await User.updateOne(
    { email: 'admin@sportszone.com' },
    { $set: { venueId } },
    { upsert: true }
  );

  await Court.updateMany({}, { $set: { venueId } });

  const admin = await User.findOne({ email: 'admin@sportszone.com' }).lean();
  const courts = await Court.find({}).limit(3).lean();

  console.log(JSON.stringify({
    admin: { email: admin.email, venueId: admin.venueId },
    courts: courts.map((court) => ({ name: court.name, venueId: court.venueId }))
  }, null, 2));
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
