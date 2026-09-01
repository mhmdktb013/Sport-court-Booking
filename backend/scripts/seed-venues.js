import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Venue from '../models/venueModel.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

async function seedVenues() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing venues
    await Venue.deleteMany({});
    console.log('Cleared existing venues');

    // Seed test venues
    const venues = [
      {
        venueId: uuidv4(),
        name: 'Chocair Arena',
        slug: 'chocair-arena',
        logoUrl: 'https://via.placeholder.com/150?text=Chocair',
        primaryColor: '#10b981',
        secondaryColor: '#042f2e',
        accentColor: '#3b82f6',
        address: 'Hamra Street, Beirut',
        city: 'Beirut',
        country: 'Lebanon',
        phone: '+961 1 123 456',
        whatsappNumber: '+961 71 123 456',
        instagramHandle: '@chochair_arena',
        openingHour: '08:00',
        closingHour: '23:00',
        defaultSlotDuration: 60,
        currency: 'USD',
        currencySymbol: '$',
        exchangeRateToUSD: 1,
        status: 'active',
        subscriptionPlan: 'pro',
        subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        ownerEmail: 'admin@chocair.com',
        ownerName: 'Chocair Owner',
        ownerPhone: '+961 71 123 456',
        allowOnlineBookings: true,
        sendWhatsAppNotifications: true,
        isFeatureVenue: true,
      },
      {
        venueId: uuidv4(),
        name: 'SportsZone Beirut',
        slug: 'sportszone-beirut',
        logoUrl: 'https://via.placeholder.com/150?text=SportsZone',
        primaryColor: '#ec4899',
        secondaryColor: '#1e1b4b',
        accentColor: '#06b6d4',
        address: 'Downtown Beirut',
        city: 'Beirut',
        country: 'Lebanon',
        phone: '+961 1 234 567',
        whatsappNumber: '+961 71 234 567',
        instagramHandle: '@sportszone_beirut',
        openingHour: '09:00',
        closingHour: '22:00',
        defaultSlotDuration: 90,
        currency: 'LBP',
        currencySymbol: 'ل.ل',
        exchangeRateToUSD: 88000,
        status: 'active',
        subscriptionPlan: 'starter',
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ownerEmail: 'admin@sportszone.com',
        ownerName: 'SportsZone Manager',
        ownerPhone: '+961 71 234 567',
        allowOnlineBookings: true,
        sendWhatsAppNotifications: false,
        isFeatureVenue: false,
      },
      {
        venueId: uuidv4(),
        name: 'Padel Club Lebanon',
        slug: 'padel-club-lebanon',
        logoUrl: 'https://via.placeholder.com/150?text=Padel+Club',
        primaryColor: '#f59e0b',
        secondaryColor: '#78350f',
        accentColor: '#8b5cf6',
        address: 'Tripoli Sports Complex',
        city: 'Tripoli',
        country: 'Lebanon',
        phone: '+961 6 111 222',
        whatsappNumber: '+961 76 111 222',
        instagramHandle: '@padel_club_lbn',
        openingHour: '10:00',
        closingHour: '23:30',
        defaultSlotDuration: 90,
        currency: 'USD',
        currencySymbol: '$',
        exchangeRateToUSD: 1,
        status: 'trial',
        subscriptionPlan: 'starter',
        subscriptionExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        ownerEmail: 'admin@padelclub.com',
        ownerName: 'Padel Club Admin',
        ownerPhone: '+961 76 111 222',
        allowOnlineBookings: true,
        sendWhatsAppNotifications: true,
        isFeatureVenue: false,
      },
    ];

    await Venue.insertMany(venues);
    console.log(`✅ Seeded ${venues.length} venues successfully`);
    console.log('\nVenues:');
    venues.forEach((v) => {
      console.log(`  - ${v.name} (${v.slug}) - ${v.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding venues:', error);
    process.exit(1);
  }
}

seedVenues();
