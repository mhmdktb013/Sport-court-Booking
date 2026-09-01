import React from 'react';
import SlotCard from './SlotCard';
import { useBooking } from '../../context/BookingContext';
import { useVenue } from '../../context/VenueContext';

const CourtGridMatrix = ({ availabilityData }) => {
  const { selectSlotForBooking } = useBooking();
  const { venue } = useVenue();
  const currencySymbol = venue?.currencySymbol || '$';

  if (!availabilityData || !availabilityData.courtsAvailability?.length) {
    return (
      <div style={{
        padding: '4rem 1rem',
        textAlign: 'center',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
      }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
          No sports courts found
        </p>
        <p style={{ fontSize: '0.875rem' }}>
          Try selecting another sport filter or date.
        </p>
      </div>
    );
  }

  const { timeHeaders, courtsAvailability } = availabilityData;

  // Extract sport type badge color
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
    <div className="grid-container">
      <table className="matrix-table">
        <thead>
          <tr>
            <th>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Time Slots
              </div>
            </th>
            {courtsAvailability.map((courtObj) => (
              <th key={courtObj.court._id}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff' }}>
                    {courtObj.court.name}
                  </span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <span className={`badge ${getSportColor(courtObj.court.sportType)}`} style={{ fontSize: '0.65rem' }}>
                      {courtObj.court.sportType}
                    </span>
                    <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>
                      {currencySymbol}{courtObj.court.pricePerHour}/h
                    </span>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeHeaders.map((header) => {
            return (
              <tr key={header.startTime}>
                {/* Time Label Column */}
                <td className="time-column">
                  {header.startTime} - {header.endTime}
                </td>

                {/* Court Slot Cells */}
                {courtsAvailability.map((courtObj) => {
                  const slot = courtObj.slots.find((s) => s.startTime === header.startTime);

                  if (!slot) {
                    return (
                      <td key={courtObj.court._id} style={{ opacity: 0.3, fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Closed
                      </td>
                    );
                  }

                  return (
                    <td key={courtObj.court._id}>
                      <SlotCard
                        slot={slot}
                        court={courtObj.court}
                        onSelect={selectSlotForBooking}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CourtGridMatrix;
