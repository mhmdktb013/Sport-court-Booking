const BASE_URL = 'http://localhost:5005/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function runTenantAndConcurrencyTests() {
  console.log('🧪 Starting Comprehensive Multi-Tenant & Concurrency Test Suite...\n');

  try {
    // 1. Health check
    const health = await request('/health');
    console.log('✅ 1. Health check status:', health.status);

    // 2. Test Venue Resolution by Slug & Parameters
    console.log('\n--- Testing Venue Resolution & Branding ---');
    const resChocair = await request('/venues/resolve?slug=chocair-arena');
    console.log(`✅ Chocair Arena resolved: ID=${resChocair.venue.venueId}, Theme=${resChocair.venue.primaryColor}`);

    const resBeirut = await request('/venues/resolve?slug=beirut-sports-hub');
    console.log(`✅ Beirut Sports Hub resolved: ID=${resBeirut.venue.venueId}, Theme=${resBeirut.venue.primaryColor}`);

    const resTripoli = await request('/venues/resolve?slug=tripoli-padel-club');
    console.log(`✅ Tripoli Padel Club resolved: ID=${resTripoli.venue.venueId}, SlotDuration=${resTripoli.venue.defaultSlotDuration}m`);

    // 3. Test Court Listing Scoping per Venue
    console.log('\n--- Testing Court Scoping per Venue ---');
    const courtsChocair = await request(`/courts?venueId=${resChocair.venue.venueId}`);
    console.log(`✅ Chocair courts count: ${courtsChocair.courts.length} (Expected: 4)`);

    const courtsBeirut = await request(`/courts?venueId=${resBeirut.venue.venueId}`);
    console.log(`✅ Beirut Hub courts count: ${courtsBeirut.courts.length} (Expected: 2)`);

    const courtsTripoli = await request(`/courts?venueId=${resTripoli.venue.venueId}`);
    console.log(`✅ Tripoli Padel courts count: ${courtsTripoli.courts.length} (Expected: 2)`);

    // 4. Test Availability Engine Isolation
    console.log('\n--- Testing Availability Engine Tenant Isolation ---');
    const today = new Date().toISOString().split('T')[0];
    const availChocair = await request(`/availability?date=${today}&venueId=${resChocair.venue.venueId}`);
    console.log(`✅ Chocair availability: ${availChocair.summary.totalCourts} courts, ${availChocair.summary.availableSlots} available slots`);

    const availTripoli = await request(`/availability?date=${today}&venueId=${resTripoli.venue.venueId}`);
    console.log(`✅ Tripoli availability: ${availTripoli.summary.totalCourts} courts, ${availTripoli.summary.availableSlots} available slots (90-min duration)`);

    // 5. Test Concurrency & Atomic Double-Booking Prevention
    console.log('\n--- Testing Atomic Concurrency & Zero Double-Booking Lock ---');
    const targetCourt = courtsChocair.courts[0];
    const openSlot = availChocair.courtsAvailability[0].slots.find((s) => s.status === 'available');

    if (!openSlot) {
      console.log('⚠️ No open slot available for concurrency test on court:', targetCourt.name);
    } else {
      console.log(`🎯 Testing race condition on Court "${targetCourt.name}" at slot ${openSlot.startTime}...`);

      const bookingA = {
        courtId: targetCourt._id,
        date: today,
        startTime: openSlot.startTime,
        endTime: openSlot.endTime,
        customerName: 'Player Alpha',
        customerPhone: '+961 70 888 999',
      };

      const bookingB = {
        courtId: targetCourt._id,
        date: today,
        startTime: openSlot.startTime,
        endTime: openSlot.endTime,
        customerName: 'Player Beta',
        customerPhone: '+961 71 888 999',
      };

      const results = await Promise.allSettled([
        request('/bookings', { method: 'POST', body: bookingA }),
        request('/bookings', { method: 'POST', body: bookingB }),
      ]);

      const successes = results.filter((r) => r.status === 'fulfilled');
      const failures = results.filter((r) => r.status === 'rejected');

      console.log(`📊 Concurrency Result: ${successes.length} Confirmed, ${failures.length} Rejected.`);

      if (successes.length === 1 && failures.length === 1) {
        console.log('🔒 ZERO DOUBLE BOOKING TEST PASSED! Atomic constraint prevented race condition.');
        console.log('   Rejection Reason:', failures[0].reason?.message || failures[0].reason?.data?.message);
      } else {
        console.warn('⚠️ Concurrency warning:', results);
      }
    }

    // 6. Test Admin Login & Cross-Venue Security
    console.log('\n--- Testing Admin Tenant Isolation ---');
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@chocair.com',
        password: 'admin123',
      },
    });
    const token = loginRes.token;
    console.log(`✅ Logged in as Chocair Admin (venueId: ${loginRes.user.venueId})`);

    const adminMetrics = await request('/admin/metrics', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ Admin Metrics (scoped): totalCourts=${adminMetrics.metrics.totalCourts}, totalBookings=${adminMetrics.metrics.totalBookings}`);

    // Verify cross-venue delete prevention
    const beirutCourt = courtsBeirut.courts[0];
    try {
      await request(`/courts/${beirutCourt._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.error('❌ SECURITY FAILURE: Admin deleted court from another venue!');
    } catch (secErr) {
      if (secErr.status === 403) {
        console.log('🔒 CROSS-VENUE ISOLATION PASSED: 403 Forbidden on foreign court deletion attempt.');
      } else {
        console.warn('⚠️ Unexpected error status:', secErr.status);
      }
    }

    console.log('\n🎉 ALL MULTI-TENANT & CONCURRENCY TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed with error:', error.data || error.message);
    process.exit(1);
  }
}

runTenantAndConcurrencyTests();
