/**
 * Generates slot intervals (e.g. 08:00 to 23:00 in 60min increments)
 */
export function generateDayTimeSlots(openingTime = '08:00', closingTime = '23:00', slotDuration = 60) {
  const slots = [];
  const [startHour, startMin] = openingTime.split(':').map(Number);
  const [endHour, endMin] = closingTime.split(':').map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  while (currentMinutes + slotDuration <= endMinutes) {
    const sH = Math.floor(currentMinutes / 60);
    const sM = currentMinutes % 60;
    const eMinutes = currentMinutes + slotDuration;
    const eH = Math.floor(eMinutes / 60);
    const eM = eMinutes % 60;

    const startTime = `${String(sH).padStart(2, '0')}:${String(sM).padStart(2, '0')}`;
    const endTime = `${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}`;

    slots.push({
      startTime,
      endTime,
      duration: slotDuration,
    });

    currentMinutes += slotDuration;
  }

  return slots;
}

/**
 * Checks if a slot time is in the past for a given date string (YYYY-MM-DD)
 */
export function isSlotInPast(dateStr, startTimeStr) {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (dateStr < todayStr) {
      return true;
    }
    if (dateStr > todayStr) {
      return false;
    }

    // If date is today, check current hour & minute
    const currentHours = today.getHours();
    const currentMins = today.getMinutes();
    const [sH, sM] = startTimeStr.split(':').map(Number);

    if (sH < currentHours || (sH === currentHours && sM <= currentMins)) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
}

/**
 * Checks if a time string (HH:mm) falls within a start-end range (HH:mm - HH:mm)
 */
export function isTimeInPeakRange(timeStr, startTimeStr, endTimeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const [sH, sM] = startTimeStr.split(':').map(Number);
  const [eH, eM] = endTimeStr.split(':').map(Number);

  const timeMinutes = h * 60 + m;
  const startMinutes = sH * 60 + sM;
  const endMinutes = eH * 60 + eM;

  return timeMinutes >= startMinutes && timeMinutes < endMinutes;
}

/**
 * Calculates slot price with venue peak pricing rules if enabled
 */
export function calculateSlotPrice(basePricePerHour, slotDurationMinutes = 60, startTime, venue = null) {
  // Base price proportioned to slot duration (e.g. 60 min -> 1.0, 90 min -> 1.5)
  const durationMultiplier = slotDurationMinutes / 60;
  let price = basePricePerHour * durationMultiplier;

  if (venue?.enablePeakPricing && Array.isArray(venue.peakPricingHours)) {
    for (const rule of venue.peakPricingHours) {
      if (rule.startTime && rule.endTime && isTimeInPeakRange(startTime, rule.startTime, rule.endTime)) {
        if (rule.priceMultiplier && rule.priceMultiplier > 0) {
          price = Math.round(price * rule.priceMultiplier);
          break;
        }
      }
    }
  }

  return price;
}

/**
 * Computes availability matrix for courts on a given date
 */
export function computeCourtAvailability({
  courts,
  bookings,
  blockedSlots = [],
  date,
  venue = null,
  includeBookingDetails = false,
}) {
  return courts.map((court) => {
    const openingTime = court.openingTime || venue?.openingHour || '08:00';
    const closingTime = court.closingTime || venue?.closingHour || '23:00';
    const slotDuration = court.slotDurationMinutes || venue?.defaultSlotDuration || 60;

    const baseSlots = generateDayTimeSlots(openingTime, closingTime, slotDuration);

    // Filter bookings for this court
    const courtBookings = bookings.filter(
      (b) =>
        b.court.toString() === court._id.toString() &&
        b.date === date &&
        b.status !== 'cancelled'
    );

    // Filter blocked slots for this court
    const courtBlocked = blockedSlots.filter(
      (bs) => bs.court.toString() === court._id.toString() && bs.date === date
    );

    const slots = baseSlots.map((baseSlot) => {
      const isPast = isSlotInPast(date, baseSlot.startTime);
      const slotPrice = calculateSlotPrice(
        court.pricePerHour,
        baseSlot.duration || slotDuration,
        baseSlot.startTime,
        venue
      );

      // Check if blocked by admin
      const blocked = courtBlocked.find((bs) => bs.startTime === baseSlot.startTime);
      if (blocked) {
        return {
          ...baseSlot,
          status: 'blocked',
          price: slotPrice,
          reason: blocked.reason || 'Maintenance',
          blockedId: blocked._id,
        };
      }

      // Check if booked
      const existingBooking = courtBookings.find((b) => b.startTime === baseSlot.startTime);
      if (existingBooking) {
        return {
          ...baseSlot,
          status: 'booked',
          price: slotPrice,
          bookingId: existingBooking.bookingId,
          ...(includeBookingDetails
            ? {
                bookingDbId: existingBooking._id,
                customerName: existingBooking.customerName,
                customerPhone: existingBooking.customerPhone,
                customerEmail: existingBooking.customerEmail,
                bookingStatus: existingBooking.status,
              }
            : {}),
        };
      }

      if (isPast) {
        return {
          ...baseSlot,
          status: 'past',
          price: slotPrice,
        };
      }

      return {
        ...baseSlot,
        status: 'available',
        price: slotPrice,
      };
    });

    return {
      court: {
        _id: court._id,
        venueId: court.venueId,
        name: court.name,
        sportType: court.sportType,
        surface: court.surface,
        environment: court.environment,
        features: court.features,
        images: court.images,
        pricePerHour: court.pricePerHour,
        openingTime,
        closingTime,
        slotDurationMinutes: slotDuration,
      },
      date,
      slots,
      totalSlots: slots.length,
      availableSlotsCount: slots.filter((s) => s.status === 'available').length,
    };
  });
}
