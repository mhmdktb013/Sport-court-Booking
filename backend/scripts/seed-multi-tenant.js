import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Venue from '../models/venueModel.js';
import Court from '../models/courtModel.js';
import User from '../models/userModel.js';
import Booking from '../models/bookingModel.js';
import BlockedSlot from '../models/blockedSlotModel.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const VENUE_CHOCAIR = {
  venueId: '63c0ffd3-4d4c-4745-b12a-bc2a1c8e7836',
  name: 'Chocair Arena',
  slug: 'chocair-arena',
  subdomain: 'chocair',
  customDomain: 'booking.chocairarena.com',
  logoUrl: '',
  primaryColor: '#10b981', // emerald
  secondaryColor: '#042f2e',
  accentColor: '#3b82f6',
  address: 'Hamra Street, Main Complex',
  city: 'Beirut',
  country: 'Lebanon',
  phone: '+961 1 123 456',
  whatsappNumber: '+961 71 123 456',
  instagramHandle: '@chocair_arena',
  websiteUrl: 'https://chocairarena.com',
  openingHour: '08:00',
  closingHour: '23:00',
  defaultSlotDuration: 60,
  currency: 'USD',
  currencySymbol: '$',
  exchangeRateToUSD: 1,
  status: 'active',
  subscriptionPlan: 'pro',
  ownerEmail: 'admin@chocair.com',
  ownerName: 'Chocair Management',
  ownerPhone: '+961 71 123 456',
  allowOnlineBookings: true,
  sendWhatsAppNotifications: true,
};

const VENUE_BEIRUT_HUB = {
  venueId: 'a1b2c3d4-e5f6-7890-abcd-112233445566',
  name: 'Beirut Sports Hub',
  slug: 'beirut-sports-hub',
  subdomain: 'beirut-hub',
  customDomain: 'booking.beiruthub.com',
  logoUrl: '',
  primaryColor: '#ec4899', // pink/rose
  secondaryColor: '#1e1b4b',
  accentColor: '#06b6d4',
  address: 'Corniche El Manara, Waterfront',
  city: 'Beirut',
  country: 'Lebanon',
  phone: '+961 1 987 654',
  whatsappNumber: '+961 76 987 654',
  instagramHandle: '@beirutsportshub',
  websiteUrl: 'https://beiruthub.com',
  openingHour: '07:00',
  closingHour: '22:00',
  defaultSlotDuration: 60,
  currency: 'USD',
  currencySymbol: '$',
  exchangeRateToUSD: 1,
  status: 'active',
  subscriptionPlan: 'enterprise',
  ownerEmail: 'admin@beiruthub.com',
  ownerName: 'Beirut Hub Owner',
  ownerPhone: '+961 76 987 654',
  allowOnlineBookings: true,
  sendWhatsAppNotifications: true,
};

const VENUE_TRIPOLI_PADEL = {
  venueId: 'f9e8d7c6-b5a4-3210-fedc-998877665544',
  name: 'Tripoli Padel Club',
  slug: 'tripoli-padel-club',
  subdomain: 'tripoli-padel',
  customDomain: 'play.tripolipadel.com',
  logoUrl: '',
  primaryColor: '#f59e0b', // amber / gold
  secondaryColor: '#451a03',
  accentColor: '#8b5cf6',
  address: 'Mina Road, Sports Park',
  city: 'Tripoli',
  country: 'Lebanon',
  phone: '+961 6 222 333',
  whatsappNumber: '+961 70 222 333',
  instagramHandle: '@tripolipadel',
  websiteUrl: 'https://tripolipadel.com',
  openingHour: '09:00',
  closingHour: '23:30',
  defaultSlotDuration: 90,
  currency: 'USD',
  currencySymbol: '$',
  exchangeRateToUSD: 1,
  status: 'active',
  subscriptionPlan: 'pro',
  ownerEmail: 'admin@tripolipadel.com',
  ownerName: 'Tripoli Padel Manager',
  ownerPhone: '+961 70 222 333',
  allowOnlineBookings: true,
  sendWhatsAppNotifications: true,
};

const courtsChocair = [
  {
    venueId: VENUE_CHOCAIR.venueId,
    name: 'Chocair Pitch 1 (7v7 AstroTurf)',
    sportType: 'football',
    description: 'Premier FIFA-approved 7-a-side artificial turf pitch with floodlights.',
    surface: 'FIFA Quality Pro AstroTurf',
    environment: 'outdoor',
    features: ['Match Quality Floodlights', 'Covered Player Dugout', 'Official Goals'],
    images: ['https://images.unsplash.com/photo-1529900245534-47fbfb57835a?auto=format&fit=crop&w=800&q=80'],
    pricePerHour: 75,
    openingTime: '08:00',
    closingTime: '23:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 1,
  },
  {
    venueId: VENUE_CHOCAIR.venueId,
    name: 'Chocair Padel Court A (Panoramic)',
    sportType: 'padel',
    description: 'Panoramic glass court with premium Mondo texturized turf.',
    surface: 'Mondo Supercourt XN',
    environment: 'indoor',
    features: ['Panoramic Glass', 'Air Conditioned', 'Tournament LED'],
    images: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80'],
    pricePerHour: 60,
    openingTime: '08:00',
    closingTime: '23:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 2,
  },
  {
    venueId: VENUE_CHOCAIR.venueId,
    name: 'Chocair Tennis Red Clay',
    sportType: 'tennis',
    description: 'Traditional Roland-Garros style red clay court.',
    surface: 'Championship Red Clay',
    environment: 'outdoor',
    features: ['Authentic Clay', 'Umpire Chair', 'Automated Sprinklers'],
    images: ['https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80'],
    pricePerHour: 50,
    openingTime: '08:00',
    closingTime: '22:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 3,
  },
  {
    venueId: VENUE_CHOCAIR.venueId,
    name: 'Chocair Basketball Hardwood',
    sportType: 'basketball',
    description: 'FIBA regulation maple hardwood arena.',
    surface: 'Robbins Solid Maple',
    environment: 'indoor',
    features: ['FIBA Regulation', 'Shot Clocks', 'Climate Controlled'],
    images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'],
    pricePerHour: 80,
    openingTime: '09:00',
    closingTime: '23:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 4,
  },
];

const courtsBeirutHub = [
  {
    venueId: VENUE_BEIRUT_HUB.venueId,
    name: 'Hub Seafront Pitch (5v5 Fast)',
    sportType: 'football',
    description: 'Enclosed cage pitch overlooking Beirut coastline.',
    surface: 'ShockPad 4G Turf',
    environment: 'outdoor',
    features: ['Sea View', 'High Tension Nets', 'LED Lighting'],
    images: ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80'],
    pricePerHour: 65,
    openingTime: '07:00',
    closingTime: '22:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 1,
  },
  {
    venueId: VENUE_BEIRUT_HUB.venueId,
    name: 'Hub Hardcourt Tennis 1',
    sportType: 'tennis',
    description: 'US Open cushion acrylic court.',
    surface: 'Laykold Acrylic Hardcourt',
    environment: 'outdoor',
    features: ['Cushioned Base', 'LED Lighting', 'Locker Room Access'],
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80'],
    pricePerHour: 55,
    openingTime: '07:00',
    closingTime: '22:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 2,
  },
];

const courtsTripoliPadel = [
  {
    venueId: VENUE_TRIPOLI_PADEL.venueId,
    name: 'Tripoli Center Padel 1',
    sportType: 'padel',
    description: 'WPT regulation panoramic padel stadium court.',
    surface: 'Mondo Supercourt XN',
    environment: 'indoor',
    features: ['Panoramic Glass', 'Pro LED', 'Scoreboard'],
    images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'],
    pricePerHour: 50,
    openingTime: '09:00',
    closingTime: '23:30',
    slotDurationMinutes: 90,
    isActive: true,
    displayOrder: 1,
  },
  {
    venueId: VENUE_TRIPOLI_PADEL.venueId,
    name: 'Tripoli Open Air Padel 2',
    sportType: 'padel',
    description: 'Outdoor sunset padel court.',
    surface: 'Texturized Monofilament',
    environment: 'outdoor',
    features: ['Anti-Glare Lighting', 'Shaded Benches'],
    images: ['https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=800&q=80'],
    pricePerHour: 45,
    openingTime: '09:00',
    closingTime: '23:30',
    slotDurationMinutes: 90,
    isActive: true,
    displayOrder: 2,
  },
];

async function seedMultiTenantDatabase() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sports_court_booking';
    await mongoose.connect(uri);
    console.log('🌱 Connected to MongoDB for Multi-Tenant Seeding...');

    // 1. Clean collections
    await Venue.deleteMany({});
    await Court.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    await BlockedSlot.deleteMany({});
    console.log('🧹 Cleaned existing database collections');

    // 2. Insert Venues
    const venues = await Venue.insertMany([
      VENUE_CHOCAIR,
      VENUE_BEIRUT_HUB,
      VENUE_TRIPOLI_PADEL,
    ]);
    console.log(`🏢 Created ${venues.length} Multi-Tenant Venues:`);
    venues.forEach((v) => console.log(`   - ${v.name} (slug: "${v.slug}", ID: ${v.venueId})`));

    // 3. Create Admin Users per venue
    const adminChocair = await User.create({
      name: 'Chocair Admin',
      email: 'admin@chocair.com',
      password: 'admin123',
      role: 'admin',
      venueId: VENUE_CHOCAIR.venueId,
      phone: '+961 71 123 456',
    });

    const adminBeirutHub = await User.create({
      name: 'Beirut Hub Admin',
      email: 'admin@beiruthub.com',
      password: 'admin123',
      role: 'admin',
      venueId: VENUE_BEIRUT_HUB.venueId,
      phone: '+961 76 987 654',
    });

    const adminTripoli = await User.create({
      name: 'Tripoli Padel Admin',
      email: 'admin@tripolipadel.com',
      password: 'admin123',
      role: 'admin',
      venueId: VENUE_TRIPOLI_PADEL.venueId,
      phone: '+961 70 222 333',
    });
    console.log('👤 Created scoped venue admins:');
    console.log(`   - ${adminChocair.email} -> Chocair Arena`);
    console.log(`   - ${adminBeirutHub.email} -> Beirut Sports Hub`);
    console.log(`   - ${adminTripoli.email} -> Tripoli Padel Club`);

    // 4. Insert Courts per venue
    const allCourtsData = [...courtsChocair, ...courtsBeirutHub, ...courtsTripoliPadel];
    const createdCourts = await Court.insertMany(allCourtsData);
    console.log(`🏟️ Inserted ${createdCourts.length} courts across all 3 venues.`);

    // 5. Create sample bookings for today
    const today = new Date().toISOString().split('T')[0];

    const chocairCourt0 = createdCourts.find((c) => c.venueId === VENUE_CHOCAIR.venueId);
    const beirutCourt0 = createdCourts.find((c) => c.venueId === VENUE_BEIRUT_HUB.venueId);

    const bookingsToInsert = [
      {
        bookingId: 'SZ-10101',
        slotLockKey: `${chocairCourt0._id}_${today}_18:00`,
        venueId: VENUE_CHOCAIR.venueId,
        court: chocairCourt0._id,
        courtName: chocairCourt0.name,
        sportType: chocairCourt0.sportType,
        date: today,
        startTime: '18:00',
        endTime: '19:00',
        duration: 60,
        price: chocairCourt0.pricePerHour,
        customerName: 'Karim Benzema',
        customerPhone: '+961 70 111 222',
        customerEmail: 'karim@example.com',
        status: 'confirmed',
        isPhoneVerified: true,
      },
      {
        bookingId: 'SZ-20202',
        slotLockKey: `${beirutCourt0._id}_${today}_19:00`,
        venueId: VENUE_BEIRUT_HUB.venueId,
        court: beirutCourt0._id,
        courtName: beirutCourt0.name,
        sportType: beirutCourt0.sportType,
        date: today,
        startTime: '19:00',
        endTime: '20:00',
        duration: 60,
        price: beirutCourt0.pricePerHour,
        customerName: 'Luka Modric',
        customerPhone: '+961 71 333 444',
        customerEmail: 'luka@example.com',
        status: 'confirmed',
        isPhoneVerified: true,
      },
    ];

    await Booking.insertMany(bookingsToInsert);
    console.log(`📝 Created ${bookingsToInsert.length} isolated sample bookings.`);

    console.log('\n🎉 Multi-Tenant Database Seed Complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedMultiTenantDatabase();
