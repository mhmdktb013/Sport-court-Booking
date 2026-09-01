import React, { useState } from 'react';
import SlotCard from './SlotCard';
import { useBooking } from '../../context/BookingContext';
import { useVenue } from '../../context/VenueContext';
import { ChevronDown, ChevronUp, MapPin, Sparkles, Clock } from 'lucide-react';

const CourtCardList = ({ availabilityData }) => {
  const { selectSlotForBooking } = useBooking();
  const { venue } = useVenue();
  const currencySymbol = venue?.currencySymbol || '$';
  const [collapsedCourts, setCollapsedCourts] = useState({});

  if (!availabilityData || !availabilityData.courtsAvailability?.length) {
    return (
      <div style={{
        padding: '3rem 1rem',
        textAlign: 'center',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
      }}>
        No courts found for the selected criteria.
      </div>
    );
  }

  const toggleCollapse = (id) => {
    setCollapsedCourts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getSportColor = (sport) => {
    switch (sport) {
      case 'football': return 'badge-green';
      case 'padel': return 'badge-blue';
      case 'tennis': return 'badge-orange';
      case 'basketball': return 'badge-purple';
      default: return 'badge-gray';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {availabilityData.courtsAvailability.map((courtObj) => {
        const { court, slots, availableSlotsCount } = courtObj;
        const isCollapsed = collapsedCourts[court._id];

        return (
          <div key={court._id} className="mobile-court-card">
            {/* Header / Summary Bar */}
            <div
              onClick={() => toggleCollapse(court._id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: '#1b253b',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  <img
                    src={court.images?.[0] || 'https://images.unsplash.com/photo-1529900245534-47fbfb57835a?auto=format&fit=crop&w=200&q=80'}
                    alt={court.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                      {court.name}
                    </h3>
                    <span className={`badge ${getSportColor(court.sportType)}`} style={{ fontSize: '0.65rem' }}>
                      {court.sportType}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {court.surface} • <strong>{currencySymbol}{court.pricePerHour}/hr</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                  {availableSlotsCount} Open
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.35rem', borderRadius: '50%' }}
                  aria-label="Expand Court Slots"
                >
                  {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
              </div>
            </div>

            {/* Slots Grid */}
            {!isCollapsed && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Select an available time slot:
                </div>
                <div className="mobile-slots-grid">
                  {slots.map((slot) => (
                    <SlotCard
                      key={slot.startTime}
                      slot={slot}
                      court={court}
                      onSelect={selectSlotForBooking}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourtCardList;
