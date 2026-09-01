import React, { useState, useMemo } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useVenue } from '../../context/VenueContext';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
  Sun,
  Moon,
  Lock,
  Sparkles,
  Share2,
} from 'lucide-react';

// 12-hour format helper
function format12Hour(timeStr) {
  if (!timeStr) return { time: '', ampm: '', formatted: '' };
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return {
    time: `${h}:${mStr}`,
    ampm,
    formatted: `${h}:${mStr} ${ampm}`,
  };
}

const MobileBookingExperience = ({ availabilityData }) => {
  const {
    selectedDate,
    setSelectedDate,
    selectedSport,
    setSelectedSport,
    selectSlotForBooking,
  } = useBooking();

  const { venue } = useVenue();
  const currencySymbol = venue?.currencySymbol || '$';

  // State
  const [bookingMode, setBookingMode] = useState('hour'); // 'hour' (By Hour) | 'court' (By Court)
  const [timePeriod, setTimePeriod] = useState('all'); // 'all' | 'am' | 'pm'
  const [expandedHour, setExpandedHour] = useState(null); // startTime of expanded slot
  const [dateStartIndex, setDateStartIndex] = useState(0);

  // Extract sports actually present in the courts
  const sportsList = useMemo(() => {
    const defaultSports = [
      { id: 'football', label: 'Football', icon: '⚽' },
      { id: 'padel', label: 'Padel', icon: '🎾' },
      { id: 'tennis', label: 'Tennis', icon: '🎾' },
      { id: 'basketball', label: 'Basketball', icon: '🏀' },
    ];

    if (!availabilityData?.courtsAvailability?.length) {
      return defaultSports;
    }

    const detected = new Set(
      availabilityData.courtsAvailability.map((c) => c.court.sportType)
    );

    const list = defaultSports.filter((s) => detected.has(s.id));
    return list.length > 0 ? list : defaultSports;
  }, [availabilityData]);

  // Set initial selected sport if current is 'all'
  React.useEffect(() => {
    if (selectedSport === 'all' && sportsList.length > 0) {
      setSelectedSport(sportsList[0].id);
    }
  }, [selectedSport, sportsList, setSelectedSport]);

  // Generate 30 days of selectable date pills
  const allDatePills = useMemo(() => {
    const pills = [];
    const base = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dayNum = d.getDate();
      const monthNum = d.getMonth() + 1;
      pills.push({
        dateStr,
        dayName,
        dayNum,
        monthNum,
        label: `${dayNum}/${monthNum}`,
        fullDateFormatted: `${String(dayNum).padStart(2, '0')}/${String(monthNum).padStart(2, '0')}/${d.getFullYear()}`,
        isToday: i === 0,
      });
    }
    return pills;
  }, []);

  // Visible slice of date pills (7 visible at a time with prev/next arrows)
  const visibleDatePills = useMemo(() => {
    return allDatePills.slice(dateStartIndex, dateStartIndex + 7);
  }, [allDatePills, dateStartIndex]);

  const handlePrevDates = () => {
    setDateStartIndex((prev) => Math.max(0, prev - 4));
  };

  const handleNextDates = () => {
    setDateStartIndex((prev) => Math.min(allDatePills.length - 7, prev + 4));
  };

  // Aggregate time slots across all courts for this sport & date
  const aggregatedTimeSlots = useMemo(() => {
    if (!availabilityData || !availabilityData.courtsAvailability?.length) {
      return [];
    }

    const { timeHeaders, courtsAvailability } = availabilityData;

    return timeHeaders.map((header) => {
      const courtsStatusList = [];
      let availableCount = 0;
      let bookedCount = 0;
      let pastCount = 0;
      let blockedCount = 0;

      courtsAvailability.forEach((courtObj) => {
        const slot = courtObj.slots.find((s) => s.startTime === header.startTime);
        if (slot) {
          const isAvailable = slot.status === 'available';
          const isBooked = slot.status === 'booked';
          const isPast = slot.status === 'past';
          const isBlocked = slot.status === 'blocked';

          if (isAvailable) availableCount++;
          if (isBooked) bookedCount++;
          if (isPast) pastCount++;
          if (isBlocked) blockedCount++;

          courtsStatusList.push({
            court: courtObj.court,
            slot,
            isAvailable,
            isBooked,
            isPast,
            isBlocked,
          });
        }
      });

      const start12 = format12Hour(header.startTime);
      const end12 = format12Hour(header.endTime);
      const [startH] = header.startTime.split(':').map(Number);
      const period = startH < 12 ? 'am' : 'pm';

      return {
        startTime: header.startTime,
        endTime: header.endTime,
        start12,
        end12,
        period,
        availableCount,
        totalCount: courtsStatusList.length,
        isPast: pastCount > 0 && availableCount === 0,
        isFull: availableCount === 0 && !pastCount,
        courtsStatusList,
      };
    });
  }, [availabilityData]);

  // Filter slots by AM/PM
  const filteredTimeSlots = useMemo(() => {
    if (timePeriod === 'all') return aggregatedTimeSlots;
    return aggregatedTimeSlots.filter((slot) => slot.period === timePeriod);
  }, [aggregatedTimeSlots, timePeriod]);

  // Auto-expand first slot with availability if none expanded
  React.useEffect(() => {
    if (!expandedHour && filteredTimeSlots.length > 0) {
      const firstAvailable = filteredTimeSlots.find((s) => s.availableCount > 0);
      if (firstAvailable) {
        setExpandedHour(firstAvailable.startTime);
      }
    }
  }, [filteredTimeSlots, expandedHour]);

  const handleToggleHour = (startTime) => {
    setExpandedHour((prev) => (prev === startTime ? null : startTime));
  };

  const selectedPill = allDatePills.find((p) => p.dateStr === selectedDate) || allDatePills[0];

  return (
    <div className="sz-mobile-app-wrapper">
      {/* 1. TOP PROMO / SHARE HERO BANNER */}
      <div className="sz-promo-banner">
        <div className="sz-promo-badge">
          <Share2 size={13} />
          <span>INSTANT MATCH LINK</span>
        </div>
        <div className="sz-promo-title">
          SHARE THE BOOKING LINK WITH YOUR FRIENDS
        </div>
        <div className="sz-promo-sub">
          Lock in your match time, split the court fee, and get instant verified booking.
        </div>
      </div>

      {/* 2. SPORT RADIO PILLS */}
      <div className="sz-sport-pills-row">
        {sportsList.map((sport) => {
          const isActive = selectedSport === sport.id;
          return (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`sz-sport-pill ${isActive ? 'active' : ''}`}
            >
              <span className="sz-sport-radio-dot"></span>
              <span className="sz-sport-icon">{sport.icon}</span>
              <span className="sz-sport-name">{sport.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. VIEW MODE & DATE PICKER HEADER */}
      <div className="sz-controls-header">
        {/* Toggle [ By Hour ] [ By Court ] */}
        <div className="sz-mode-toggle">
          <button
            onClick={() => setBookingMode('hour')}
            className={`sz-mode-btn ${bookingMode === 'hour' ? 'active' : ''}`}
          >
            By Hour
          </button>
          <button
            onClick={() => setBookingMode('court')}
            className={`sz-mode-btn ${bookingMode === 'court' ? 'active' : ''}`}
          >
            By Court
          </button>
        </div>

        {/* Date Display Pill with Native Datepicker */}
        <label className="sz-date-input-label">
          <CalendarIcon size={16} className="sz-date-icon" />
          <span className="sz-date-text">{selectedPill.fullDateFormatted}</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="sz-native-date-hidden"
          />
        </label>
      </div>

      {/* 4. HORIZONTAL CALENDAR STRIP */}
      <div className="sz-date-strip-container">
        <button
          onClick={handlePrevDates}
          disabled={dateStartIndex === 0}
          className="sz-date-arrow-btn"
          aria-label="Previous dates"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="sz-date-strip-list">
          {visibleDatePills.map((p) => {
            const isSelected = p.dateStr === selectedDate;
            return (
              <button
                key={p.dateStr}
                onClick={() => {
                  setSelectedDate(p.dateStr);
                  setExpandedHour(null);
                }}
                className={`sz-date-box ${isSelected ? 'active' : ''}`}
              >
                <span className="sz-date-dayname">{p.dayName}</span>
                <span className="sz-date-daynum">{p.dayNum}/{p.monthNum}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextDates}
          disabled={dateStartIndex >= allDatePills.length - 7}
          className="sz-date-arrow-btn"
          aria-label="Next dates"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 5. AM / PM FILTER TOGGLE (Only in By Hour mode) */}
      {bookingMode === 'hour' && (
        <div className="sz-ampm-switch-row">
          <button
            onClick={() => setTimePeriod('all')}
            className={`sz-ampm-tab ${timePeriod === 'all' ? 'active' : ''}`}
          >
            All Day
          </button>
          <button
            onClick={() => setTimePeriod('am')}
            className={`sz-ampm-tab ${timePeriod === 'am' ? 'active' : ''}`}
          >
            <Sun size={15} />
            <span>AM</span>
          </button>
          <button
            onClick={() => setTimePeriod('pm')}
            className={`sz-ampm-tab ${timePeriod === 'pm' ? 'active' : ''}`}
          >
            <Moon size={15} />
            <span>PM</span>
          </button>
        </div>
      )}

      {/* 6. MAIN CONTENT AREA */}
      {bookingMode === 'hour' ? (
        /* ============================================================
           MODE 1: BY HOUR (SportZone signature list with court cards)
           ============================================================ */
        <div className="sz-time-slots-wrapper">
          {filteredTimeSlots.length === 0 ? (
            <div className="sz-empty-notice">
              No slots scheduled for this time filter.
            </div>
          ) : (
            filteredTimeSlots.map((slotObj) => {
              const isExpanded = expandedHour === slotObj.startTime;

              return (
                <div
                  key={slotObj.startTime}
                  className={`sz-time-slot-accordion ${isExpanded ? 'is-expanded' : ''}`}
                >
                  {/* Slot Header Row */}
                  <div
                    onClick={() => handleToggleHour(slotObj.startTime)}
                    className="sz-time-slot-header"
                  >
                    {/* Time Label (e.g. 9:30 PM -> 11:00 PM) */}
                    <div className="sz-slot-time-display">
                      <span className="sz-start-time">
                        {slotObj.start12.time}{' '}
                        <span className="sz-ampm-tag">{slotObj.start12.ampm}</span>
                      </span>
                      <span className="sz-time-separator">→</span>
                      <span className="sz-end-time">
                        {slotObj.end12.time}{' '}
                        <span className="sz-ampm-tag-muted">{slotObj.end12.ampm}</span>
                      </span>
                    </div>

                    {/* Right Badge: [ 3 ] Green pill or [ FULL ] */}
                    <div className="sz-slot-badge-action">
                      {slotObj.isPast ? (
                        <span className="sz-badge-past">Past</span>
                      ) : slotObj.availableCount > 0 ? (
                        <span className="sz-badge-count">
                          {slotObj.availableCount}
                        </span>
                      ) : (
                        <span className="sz-badge-full">FULL</span>
                      )}

                      <span className={`sz-chevron-indicator ${isExpanded ? 'open' : ''}`}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronRight size={18} />}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Courts Grid for this Time Slot */}
                  {isExpanded && (
                    <div className="sz-expanded-courts-grid">
                      {slotObj.courtsStatusList.map(
                        ({ court, slot, isAvailable, isBooked, isPast, isBlocked }) => {
                          if (isAvailable) {
                            return (
                              <button
                                key={court._id}
                                onClick={() => selectSlotForBooking(court, slot)}
                                className="sz-court-btn sz-court-available"
                              >
                                <span className="sz-court-btn-title">
                                  {court.name}
                                </span>
                                <span className="sz-court-btn-sub">
                                  {court.environment || court.surface} • {currencySymbol}{slot.price}
                                </span>
                              </button>
                            );
                          }

                          // Booked state: Red/pink bordered card with lock
                          if (isBooked) {
                            return (
                              <div
                                key={court._id}
                                className="sz-court-btn sz-court-booked"
                              >
                                <span className="sz-court-btn-title">
                                  <Lock size={12} className="sz-lock-icon" />
                                  {court.name}
                                </span>
                                <span className="sz-court-btn-sub">Booked</span>
                              </div>
                            );
                          }

                          // Blocked / Maintenance state
                          if (isBlocked) {
                            return (
                              <div
                                key={court._id}
                                className="sz-court-btn sz-court-blocked"
                              >
                                <span className="sz-court-btn-title">
                                  <Lock size={12} className="sz-lock-icon" />
                                  {court.name}
                                </span>
                                <span className="sz-court-btn-sub">Maintenance</span>
                              </div>
                            );
                          }

                          // Past state
                          return (
                            <div
                              key={court._id}
                              className="sz-court-btn sz-court-past"
                            >
                              <span className="sz-court-btn-title">{court.name}</span>
                              <span className="sz-court-btn-sub">Past</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* ============================================================
           MODE 2: BY COURT (Cards per Court with Slot Chips)
           ============================================================ */
        <div className="sz-by-court-list">
          {availabilityData?.courtsAvailability?.map((courtObj) => {
            const { court, slots, availableSlotsCount } = courtObj;
            return (
              <div key={court._id} className="sz-court-card-block">
                <div className="sz-court-card-head">
                  <div>
                    <h3 className="sz-court-name">{court.name}</h3>
                    <div className="sz-court-details">
                      {court.surface} • {court.environment} • {currencySymbol}{court.pricePerHour}/hr
                    </div>
                  </div>
                  <span className="sz-court-open-badge">
                    {availableSlotsCount} Open
                  </span>
                </div>

                <div className="sz-court-slots-chips">
                  {slots.map((slot) => {
                    const isAvail = slot.status === 'available';
                    const isBook = slot.status === 'booked';
                    const slot12 = format12Hour(slot.startTime);

                    if (isAvail) {
                      return (
                        <button
                          key={slot.startTime}
                          onClick={() => selectSlotForBooking(court, slot)}
                          className="sz-chip-btn sz-chip-available"
                        >
                          <span className="sz-chip-time">{slot12.formatted}</span>
                          <span className="sz-chip-price">{currencySymbol}{slot.price}</span>
                        </button>
                      );
                    }

                    if (isBook) {
                      return (
                        <div key={slot.startTime} className="sz-chip-btn sz-chip-booked">
                          <span className="sz-chip-time">{slot12.formatted}</span>
                          <span className="sz-chip-status"><Lock size={10} /> Booked</span>
                        </div>
                      );
                    }

                    return (
                      <div key={slot.startTime} className="sz-chip-btn sz-chip-past">
                        <span className="sz-chip-time">{slot12.formatted}</span>
                        <span className="sz-chip-status">Past</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MobileBookingExperience;
