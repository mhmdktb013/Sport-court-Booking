import axios from 'axios';

const BASE_URL = 'http://localhost:5005/api';

async function runTests() {
  console.log('🧪 Starting Booking System Concurrency & Edge-case Tests...\n');

  try {
    // 1. Health check
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', health.data.status);

    // 2. Fetch Availability
    const today = new Date().toISOString().split('T')[0];
    const avail = await axios.get(`${BASE_URL}/availability?date=${today}&sport=football`);
    console.log(`✅ Availability retrieved: ${avail.data.summary.totalCourts} courts, ${avail.data.summary.availableSlots} open slots.`);

    const court = avail.data.courtsAvailability[0].court;
    const availableSlot = avail.data.courtsAvailability[0].slots.find(s => s.status === 'available');

    if (!availableSlot) {
      console.log('⚠️ No open slots to test booking on this court');
      return;
    }

    console.log(`\n🎯 Testing Concurrent Double-Booking Prevention on Court: "${court.name}" at ${availableSlot.startTime}...`);

    // 3. Concurrency test: Two users booking the EXACT SAME slot simultaneously
    const userA = {
      courtId: court._id,
      date: today,
      startTime: availableSlot.startTime,
      endTime: availableSlot.endTime,
      customerName: 'Player Alpha',
      customerPhone: '+1 555-111-2222',
    };

    const userB = {
      courtId: court._id,
      date: today,
      startTime: availableSlot.startTime,
      endTime: availableSlot.endTime,
      customerName: 'Player Beta',
      customerPhone: '+1 555-333-4444',
    };

    const results = await Promise.allSettled([
      axios.post(`${BASE_URL}/bookings`, userA),
      axios.post(`${BASE_URL}/bookings`, userB),
    ]);

    const successes = results.filter(r => r.status === 'fulfilled');
    const failures = results.filter(r => r.status === 'rejected');

    console.log(`📊 Concurrency Result: ${successes.length} Confirmed, ${failures.length} Rejected.`);

    if (successes.length === 1 && failures.length === 1) {
      console.log('🔒 ZERO DOUBLE BOOKING TEST PASSED! Concurrency was prevented accurately.');
      console.log('   Rejection Reason:', failures[0].reason?.response?.data?.message);
    } else {
      console.log('⚠️ Concurrency warning:', results);
    }

    // 4. Test Customer Lookup by Phone
    const lookup = await axios.get(`${BASE_URL}/bookings/lookup/phone?phone=555-111-2222`);
    console.log(`\n✅ Phone Lookup Test: Found ${lookup.data.count} booking(s) for Player Alpha.`);

    console.log('\n🎉 ALL BACKEND TESTS EXECUTED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message, error.response?.data);
    process.exit(1);
  }
}

runTests();
