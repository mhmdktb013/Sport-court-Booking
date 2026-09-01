import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Venue from '../models/venueModel.js';

dotenv.config();

async function linkAdminToVenue() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the first venue (Chocair Arena)
    const venue = await Venue.findOne({ slug: 'chocair-arena' });
    if (!venue) {
      console.error('❌ Chocair Arena venue not found');
      process.exit(1);
    }

    // Update or create admin user
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@sportszone.com' },
      {
        name: 'Chocair Admin',
        venueId: venue.venueId,
        role: 'admin',
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Admin user linked to venue: ${adminUser.email}`);
    console.log(`   Venue ID: ${adminUser.venueId}`);
    console.log(`   Venue: ${venue.name}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error linking admin to venue:', error);
    process.exit(1);
  }
}

linkAdminToVenue();
