import React from 'react';
import Modal from '../common/Modal';
import { useBooking } from '../../context/BookingContext';
import { useVenue } from '../../context/VenueContext';
import { CheckCircle, Calendar, Clock, MapPin, Share2, Copy, Check } from 'lucide-react';

const BookingSuccessModal = () => {
  const { confirmedBooking, closeSuccessModal } = useBooking();
  const { venue } = useVenue();
  const [copied, setCopied] = React.useState(false);

  if (!confirmedBooking) return null;

  const {
    bookingId,
    courtName,
    sportType,
    date,
    startTime,
    endTime,
    price,
    customerName,
    customerPhone,
  } = confirmedBooking;

  const brandName = venue?.name || 'SportsZone';
  const currencySymbol = venue?.currencySymbol || '$';

  const readableDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${brandName} Booking Confirmed!\nBooking ID: #${bookingId}\nCourt: ${courtName} (${sportType})\nDate: ${readableDate}\nTime: ${startTime} - ${endTime}\nPlayer: ${customerName}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={!!confirmedBooking} onClose={closeSuccessModal} title="" maxWidth="500px">
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        {/* Animated Checkmark Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '2px solid var(--primary)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
        }}>
          <CheckCircle size={44} strokeWidth={2.5} />
        </div>

        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
          ✓ Booking Confirmed!
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Your slot is locked in the system. An event receipt has been generated.
        </p>

        {/* Confirmation Details Card */}
        <div style={{
          background: '#0a0f1d',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          textAlign: 'left',
          marginBottom: '1.5rem',
        }}>
          {/* Reference Pill */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1rem',
            borderBottom: '1px dashed var(--border-color)',
            marginBottom: '1rem',
          }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Booking Reference</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--primary)',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
            }}>
              #{bookingId}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Court:</span>
              <strong style={{ color: '#fff' }}>{courtName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Date:</span>
              <strong style={{ color: '#fff' }}>{readableDate}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Time Slot:</span>
              <strong style={{ color: 'var(--primary)' }}>{startTime} - {endTime}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Player Name:</span>
              <strong style={{ color: '#fff' }}>{customerName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
              <strong style={{ color: '#fff' }}>{customerPhone}</strong>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-color)',
            }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Total Paid:</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{currencySymbol}{price}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleCopy} className="btn btn-secondary" style={{ flex: 1 }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Details'}
          </button>
          <button onClick={closeSuccessModal} className="btn btn-primary" style={{ flex: 1 }}>
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingSuccessModal;
