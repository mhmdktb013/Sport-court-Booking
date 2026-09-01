import React from 'react';
import { Lock, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useVenue } from '../../context/VenueContext';

const SlotCard = ({ slot, court, onSelect, compact = false }) => {
  const { status, startTime, endTime, price, reason } = slot;
  const { venue } = useVenue();
  const currencySymbol = venue?.currencySymbol || '$';

  if (status === 'available') {
    return (
      <button
        onClick={() => onSelect(court, slot)}
        className="slot-badge slot-available"
        title={`Click to book ${startTime} - ${endTime} for ${currencySymbol}${price}`}
      >
        <span>{startTime} - {endTime}</span>
        <span className="slot-price">{currencySymbol}{price} • Book</span>
      </button>
    );
  }

  if (status === 'booked') {
    return (
      <div className="slot-badge slot-booked" title="This slot is already booked">
        <span>{startTime} - {endTime}</span>
        <span style={{ fontSize: '0.7rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Lock size={10} /> Booked
        </span>
      </div>
    );
  }

  if (status === 'blocked') {
    return (
      <div className="slot-badge slot-blocked" title={`Blocked: ${reason || 'Maintenance'}`}>
        <span>{startTime} - {endTime}</span>
        <span style={{ fontSize: '0.7rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <AlertCircle size={10} /> {reason || 'Maintenance'}
        </span>
      </div>
    );
  }

  // Past
  return (
    <div className="slot-badge slot-past" title="Time slot in the past">
      <span>{startTime} - {endTime}</span>
      <span style={{ fontSize: '0.7rem', marginTop: '2px', opacity: 0.7 }}>
        Past Slot
      </span>
    </div>
  );
};

export default SlotCard;
