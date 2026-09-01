import React, { useState, useMemo } from 'react';
import { useBooking } from '../../context/BookingContext';
import { ChevronRight, ChevronDown, ChevronLeft, Calendar as CalendarIcon, Clock, Shield, Sparkles, Check, Sun, Moon } from 'lucide-react';

// Format 24h (HH:mm) into 12h AM/PM
function format12Hour(timeStr) {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${mStr} ${ampm}`;
}

const sportsList = [
  { id: 'all', label: 'All', icon: '🏆' },
  { id: 'football', label: 'Football', icon: '⚽' },
  { id: 'padel', label: 'Padel', icon: '🎾' },
  { id: 'tennis', label: 'Tennis', icon: '🎾' },
  { id: 'basketball', label: 'Basketball', icon: '🏀' },
];

const MobileBookingExperience = ({ availabilityData }) => {
  const {
    selectedDate,
    setSelectedDate,
    selectedSport,
    setSelectedSport,
    selectSlotForBooking,
  } = useBooking();

  // Booking mode: 'time' (By Time) vs 'court' (By Court)
  const [bookingMode, setBookingMode] = useState('time');
  // Time of day filter: 'all' | 'am' | 'pm'
  const [timeFilter, setTimeFilter] = useState('all');
  // Expanded time slot in 'By Time' mode
  const [expandedTime, setExpandedTime] = useState(null);
  // Expanded court in 'By Court' mode
  const [expandedCourtId, setExpandedCourtId] = useState(null);

  // Generate 14-day date pills formatted like: WED 26/8, THU 27/8
  const datePills = useMemo(() => {
    const pills = [];
    const base = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dayNum = d.getDate();
      const monthNum = d.getMonth() + 1;
      pills.push({
        dateStr,
        label: `${dayName} ${dayNum}/${monthNum}`,
        isToday: i === 0,
      });
    }
    return pills;
  }, []);

  // Aggregate time slots across all courts for the selected sport & date
  const aggregatedTimeSlots = useMemo(() => {
    if (!availabilityData || !availabilityData.courtsAvailability?.length) {
      return [];
    }

    const { timeHeaders, courtsAvailability } = availabilityData;

    return timeHeaders.map((header) => {
      const availableCourts = [];
      let totalForSlot = 0;
      let pastCount = 0;
      let blockedCount = 0;

      courtsAvailability.forEach((courtObj) => {
        const slot = courtObj.slots.find((s) => s.startTime === header.startTime);
        if (slot) {
          totalForSlot++;
          if (slot.status === 'available') {
            availableCourts.push({
              court: courtObj.court,
              slot,
            });
          } else if (slot.status === 'past') {
            pastCount++;
          } else if (slot.status === 'blocked') {
            blockedCount++;
          }
        }
      });

      const [startH] = header.startTime.split(':').map(Number);
      const period = startH < 12 ? 'am' : 'pm';

      return {
        startTime: header.startTime,
        endTime: header.endTime,
        formattedStart: format12Hour(header.startTime),
        formattedEnd: format12Hour(header.endTime),
        period,
        availableCount: availableCourts.length,
        totalCount: totalForSlot,
        isPast: pastCount > 0 && availableCourts.length === 0,
        isFullyBooked: availableCourts.length === 0 && pastCount === 0,
        availableCourts,
      };
    });
  }, [availabilityData]);

  // Filter time slots by AM / PM
  const filteredTimeSlots = useMemo(() => {
    if (timeFilter === 'all') return aggregatedTimeSlots;
    return aggregatedTimeSlots.filter((slot) => slot.period === timeFilter);
  }, [aggregatedTimeSlots, timeFilter]);

  const handleSlotToggle = (startTime, availableCount) => {
    if (availableCount === 0) return;
    setExpandedTime((prev) => (prev === startTime ? null : startTime));
  };

  const handleCourtToggle = (courtId) => {
    setExpandedCourtId((prev) => (prev === courtId ? null : courtId));
  };

  return (
    <div className="mobile-booking-container">
      {/* 1. SPORT SELECTOR PILLS */}
      <div className="mobile-sports-scroll">
        {sportsList.map((sport) => {
          const isActive = selectedSport === sport.id;
          return (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`mobile-sport-chip ${isActive ? 'active' : ''}`}
            >
              <span>{sport.icon}</span>
              <span>{sport.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. BOOKING MODE TOGGLE: [ By Time ] [ By Court ] */}
      <div className="mobile-mode-toggle-bar">
        <div className="mobile-mode-toggle">
          <button
            onClick={() => setBookingMode('time')}
            className={`mobile-mode-btn ${bookingMode === 'time' ? 'active' : ''}`}
          >
            By Time
          </button>
          <button
            onClick={() => setBookingMode('court')}
            className={`mobile-mode-btn ${bookingMode === 'court' ? 'active' : ''}`}
          >
            By Court
          </button>
        </div>
      </div>

      {/* 3. DATE SELECTOR STRIP: < WED 26/8  THU 27/8  FRI 28/8 ... > */}
      <div className="mobile-date-strip-wrapper">
        <div className="mobile-date-strip">
          {datePills.map((p) => {
            const isSelected = p.dateStr === selectedDate;
            return (
              <button
                key={p.dateStr}
                onClick={() => setSelectedDate(p.dateStr)}
                className={`mobile-date-item ${isSelected ? 'active' : ''}`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. AM / PM FILTER TOGGLE (Only in By Time mode) */}
      {bookingMode === 'time' && (
        <div className="mobile-ampm-bar">
          <div className="mobile-ampm-toggle">
            <button
              onClick={() => setTimeFilter('all')}
              className={`mobile-ampm-btn ${timeFilter === 'all' ? 'active' : ''}`}
            >
              All Day
            </button>
            <button
              onClick={() => setTimeFilter('am')}
              className={`mobile-ampm-btn ${timeFilter === 'am' ? 'active' : ''}`}
            >
              <Sun size={13} style={{ display: 'inline', marginRight: '4px' }} />
              AM
            </button>
            <button
              onClick={() => setTimeFilter('pm')}
              className={`mobile-ampm-btn ${timeFilter === 'pm' ? 'active' : ''}`}
            >
              <Moon size={13} style={{ display: 'inline', marginRight: '4px' }} />
              PM
            </button>
          </div>
        </div>
      )}

      {/* 5. MAIN CONTENT */}
      {bookingMode === 'time' ? (
        /* --- MODE 1: BY TIME (Vertical Time Slots List) --- */
        <div className="mobile-time-slots-list">
          {filteredTimeSlots.length === 0 ? (
            <div className="mobile-empty-state">
              No time slots available for this filter.
            </div>
          ) : (
            filteredTimeSlots.map((slotObj) => {
              const isExpanded = expandedTime === slotObj.startTime;
              const hasAvailable = slotObj.availableCount > 0;
              const isFull = slotObj.availableCount === 0 && !slotObj.isPast;

              return (
                <div
                  key={slotObj.startTime}
                  className={`mobile-slot-card ${isExpanded ? 'expanded' : ''} ${!hasAvailable ? 'disabled' : ''}`}
                >
                  {/* Slot Main Row */}
                  <div
                    onClick={() => handleSlotToggle(slotObj.startTime, slotObj.availableCount)}
                    className="mobile-slot-row"
                  >
                    {/* Time Label */}
                    <div className="mobile-slot-time">
                      <span className="mobile-time-start">{slotObj.formattedStart}</span>
                      <span className="mobile-time-arrow">→</span>
                      <span className="mobile-time-end">{slotObj.formattedEnd}</span>
                    </div>

                    {/* Right Badge: [ 7 ] or [ FULL ] + Arrow */}
                    <div className="mobile-slot-badge-group">
                      {slotObj.isPast ? (
                        <span className="mobile-badge-past">Past</span>
                      ) : isFull ? (
                        <span className="mobile-badge-full">FULL</span>
                      ) : (
                        <span className="mobile-badge-count">
                          {slotObj.availableCount}
                        </span>
                      )}

                      {hasAvailable && (
                        <span className={`mobile-chevron ${isExpanded ? 'open' : ''}`}>
                          <ChevronRight size={18} />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expandable Available Courts for this Time Slot */}
                  {isExpanded && hasAvailable && (
                    <div className="mobile-available-courts-box">
                      <div className="mobile-available-courts-title">
                        Available Courts ({slotObj.availableCount}):
                      </div>
                      <div className="mobile-courts-list">
                        {slotObj.availableCourts.map(({ court, slot }) => (
                          <div key={court._id} className="mobile-court-item">
                            <div className="mobile-court-item-info">
                              <div className="mobile-court-item-name">{court.name}</div>
                              <div className="mobile-court-item-sub">
                                {court.surface} • <span className="mobile-court-item-price">${court.pricePerHour}</span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                selectSlotForBooking(court, slot);
                              }}
                              className="btn btn-primary btn-sm mobile-book-btn"
                            >
                              Book
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* --- MODE 2: BY COURT --- */
        <div className="mobile-courts-view-list">
          {availabilityData?.courtsAvailability?.map((courtObj) => {
            const { court, slots, availableSlotsCount } = courtObj;
            const isExpanded = expandedCourtId === court._id;

            return (
              <div key={court._id} className="mobile-slot-card court-card">
                <div
                  onClick={() => handleCourtToggle(court._id)}
                  className="mobile-slot-row"
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
                      {court.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {court.sportType.toUpperCase()} • ${court.pricePerHour}/hr • {court.surface}
                    </div>
                  </div>

                  <div className="mobile-slot-badge-group">
                    <span className="mobile-badge-count">
                      {availableSlotsCount} Open
                    </span>
                    <span className={`mobile-chevron ${isExpanded ? 'open' : ''}`}>
                      <ChevronRight size={18} />
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mobile-available-courts-box">
                    <div className="mobile-slots-grid-chips">
                      {slots.map((slot) => {
                        const isAvailable = slot.status === 'available';
                        return (
                          <button
                            key={slot.startTime}
                            disabled={!isAvailable}
                            onClick={() => isAvailable && selectSlotForBooking(court, slot)}
                            className={`mobile-slot-chip ${slot.status}`}
                          >
                            <span className="chip-time">{format12Hour(slot.startTime)}</span>
                            <span className="chip-status">
                              {isAvailable ? `$${slot.price}` : slot.status}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MobileBookingExperience;
