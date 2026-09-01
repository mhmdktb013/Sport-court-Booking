import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Court from '../models/courtModel.js';
import User from '../models/userModel.js';
import Booking from '../models/bookingModel.js';
import BlockedSlot from '../models/blockedSlotModel.js';

dotenv.config();

const defaultVenueId = '63c0ffd3-4d4c-4745-b12a-bc2a1c8e7836';

const courtsData = [
  {
    venueId: defaultVenueId,
    name: 'Football Pitch 1 (Pro 7v7)',
    sportType: 'football',
    description: 'Premier FIFA-approved 7-a-side artificial turf pitch with floodlights and spectator seating.',
    surface: 'FIFA Quality Pro AstroTurf',
    environment: 'outdoor',
    features: ['Match Quality Floodlights', 'Covered Player Dugout', 'Official Goals', 'Locker Room Access'],
    images: [
      'https://images.unsplash.com/photo-1529900245534-47fbfb57835a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    ],
    pricePerHour: 75,
    openingTime: '08:00',
    closingTime: '24:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 1,
  },
  {
    venueId: defaultVenueId,
    name: 'Football Pitch 2 (5v5 Fast Turf)',
    sportType: 'football',
    description: 'High-speed 5-a-side enclosed cage court, perfect for fast-paced friendly matches.',
    surface: 'ShockPad 4G Turf',
    environment: 'covered',
    features: ['High-Tension Rebound Nets', 'LED Floodlights', 'Scoreboard', 'Water Station'],
    images: [
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    ],
    pricePerHour: 55,
    openingTime: '08:00',
    closingTime: '24:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 2,
  },
  {
    venueId: defaultVenueId,
    name: 'Padel Center Court (Panoramic)',
    sportType: 'padel',
    description: 'World Padel Tour regulation panoramic glass court with premium texturized monofilament turf.',
    surface: 'Mondo Supercourt XN',
    environment: 'indoor',
    features: ['Panoramic Glass (No Pillars)', 'Air Conditioned', 'Tournament LED Luminaires', 'Racket Rental Available'],
    images: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=800&q=80',
    ],
    pricePerHour: 60,
    openingTime: '07:00',
    closingTime: '24:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 3,
  },
  {
    venueId: defaultVenueId,
    name: 'Padel Court 2 (Outdoor Sun)',
    sportType: 'padel',
    description: 'Open-air panoramic glass padel court with anti-glare lighting and shock-absorbent turf.',
    surface: 'Pro Padel Texturized Turf',
    environment: 'outdoor',
    features: ['Panoramic Glass', 'Anti-Glare Floodlights', 'Perimeter Shading', 'Ball Machine on Request'],
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    ],
    pricePerHour: 45,
    openingTime: '08:00',
    closingTime: '23:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 4,
  },
  {
    venueId: defaultVenueId,
    name: 'Tennis Court 1 (Red Clay)',
    sportType: 'tennis',
    description: 'Traditional French Roland-Garros style red clay court, freshly rolled and watered daily.',
    surface: 'Championship Red Clay',
    environment: 'outdoor',
    features: ['Authentic Clay Surface', 'Umpire Chair', 'Automated Sprinkler System', 'Shaded Player Benches'],
    images: [
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80',
    ],
    pricePerHour: 50,
    openingTime: '07:00',
    closingTime: '22:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 5,
  },
  {
    venueId: defaultVenueId,
    name: 'Tennis Court 2 (Hard Court Pro)',
    sportType: 'tennis',
    description: 'US Open cushion acrylic hard court with precise ball bounce and true traction.',
    surface: 'Laykold Pro Acrylic Hardcourt',
    environment: 'outdoor',
    features: ['High-Visibility LED Lighting', 'Cushioned Base', 'Ball Boy / Storage Trolleys'],
    images: [
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80',
    ],
    pricePerHour: 45,
    openingTime: '08:00',
    closingTime: '23:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 6,
  },
  {
    venueId: defaultVenueId,
    name: 'Basketball Main Arena',
    sportType: 'basketball',
    description: 'FIBA regulation indoor hardwood court with glass backboards and professional spring-loaded rims.',
    surface: 'Robbins Solid Maple Hardwood',
    environment: 'indoor',
    features: ['Full FIBA Sizing', 'Electronic Shot Clocks & Scoreboard', 'Full Climate Control', 'Bleacher Seating'],
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
    ],
    pricePerHour: 80,
    openingTime: '09:00',
    closingTime: '23:00',
    slotDurationMinutes: 60,
    isActive: true,
    displayOrder: 7,
  },
];

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sports_court_booking';
    await mongoose.connect(uri);
    console.log('🌱 Connected to MongoDB for Seeding...');

    // 1. Clean collections
    await Court.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    await BlockedSlot.deleteMany({});
    console.log('🧹 Cleaned existing database collections');

    // 2. Create Admin User
    const adminUser = await User.create({
      name: 'SportsZone Admin',
      email: 'admin@sportszone.com',
      password: 'admin123',
      role: 'admin',
      venueId: defaultVenueId,
      phone: '+1 555-019-2831',
    });
    console.log(`👤 Admin created: ${adminUser.email} (Password: admin123)`);

    // 3. Insert Courts
    const createdCourts = await Court.insertMany(courtsData);
    console.log(`🏟️ Inserted ${createdCourts.length} sports courts`);

    // 4. Create realistic sample bookings for today and tomorrow
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date(Date.now() + 86400000);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    const sampleBookings = [
      {
        bookingId: 'SZ-90412',
        court: createdCourts[0]._id,
        courtName: createdCourts[0].name,
        sportType: createdCourts[0].sportType,
        date: today,
        startTime: '18:00',
        endTime: '19:00',
        duration: 60,
        price: createdCourts[0].pricePerHour,
        customerName: 'Marcus Rashford',
        customerPhone: '+1 555 204 9912',
        customerEmail: 'marcus@sample.com',
        status: 'confirmed',
        isPhoneVerified: true,
      },
      {
        bookingId: 'SZ-81345',
        court: createdCourts[0]._id,
        courtName: createdCourts[0].name,
        sportType: createdCourts[0].sportType,
        date: today,
        startTime: '20:00',
        endTime: '21:00',
        duration: 60,
        price: createdCourts[0].pricePerHour,
        customerName: 'David Silva',
        customerPhone: '+1 555 889 1234',
        customerEmail: 'david@sample.com',
        status: 'confirmed',
        isPhoneVerified: true,
      },
      {
        bookingId: 'SZ-72319',
        court: createdCourts[2]._id, // Padel 1
        courtName: createdCourts[2].name,
        sportType: createdCourts[2].sportType,
        date: today,
        startTime: '19:00',
        endTime: '20:00',
        duration: 60,
        price: createdCourts[2].pricePerHour,
        customerName: 'Alejandro Galan',
        customerPhone: '+1 555 334 5566',
        customerEmail: 'galan@padel.com',
        status: 'confirmed',
        isPhoneVerified: true,
      },
      {
        bookingId: 'SZ-61944',
        court: createdCourts[4]._id, // Tennis Clay
        courtName: createdCourts[4].name,
        sportType: createdCourts[4].sportType,
        date: today,
        startTime: '17:00',
        endTime: '18:00',
        duration: 60,
        price: createdCourts[4].pricePerHour,
        customerName: 'Carlos Alcaraz',
        customerPhone: '+1 555 771 2938',
        customerEmail: 'carlos@tennis.com',
        status: 'confirmed',
        isPhoneVerified: true,
      },
      {
        bookingId: 'SZ-55012',
        court: createdCourts[2]._id,
        courtName: createdCourts[2].name,
        sportType: createdCourts[2].sportType,
        date: tomorrow,
        startTime: '20:00',
        endTime: '21:00',
        duration: 60,
        price: createdCourts[2].pricePerHour,
        customerName: 'Juan Lebron',
        customerPhone: '+1 555 994 0011',
        customerEmail: 'lebron@padel.com',
        status: 'confirmed',
        isPhoneVerified: true,
      },
    ];

    await Booking.insertMany(sampleBookings);
    console.log(`📅 Created ${sampleBookings.length} sample active bookings`);

    // 5. Create a sample maintenance blocked slot
    await BlockedSlot.create({
      court: createdCourts[1]._id,
      date: today,
      startTime: '14:00',
      endTime: '15:00',
      reason: 'Net Inspection & Maintenance',
      blockedBy: 'Facility Operations',
    });
    console.log('🔒 Created 1 maintenance blocked slot');

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
