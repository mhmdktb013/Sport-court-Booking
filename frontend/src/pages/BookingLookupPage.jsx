import React, { useState } from 'react';
import { bookingService } from '../services/api';
import { useVenue } from '../context/VenueContext';
import { Search, Phone, Calendar, Clock, MapPin, XCircle, CheckCircle, AlertCircle } from 'lucide-react';

const BookingLookupPage = () => {
  const { venue } = useVenue();
  const currencySymbol = venue?.currencySymbol || '$';
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await bookingService.lookupByPhone(phoneNumber);
      if (res.data.success) {
        setBookings(res.data.bookings);
        setSearched(true);
      }
    } catch (err) {
      console.error('Lookup failed:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to find bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const reason = prompt('Please enter cancellation reason:', 'Customer requested');
    if (reason === null) return;

    try {
      await bookingService.cancelBooking(bookingId, reason);
      // Refresh list
      const res = await bookingService.lookupByPhone(phoneNumber);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Player Self-Service
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
            Find My Bookings
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Enter your mobile phone number to inspect your reservations, upcoming matches, or cancel.
          </p>
        </div>

        {/* Search Card */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <label className="input-label flex items-center gap-2">
                <Phone size={16} /> Phone Number
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="tel"
                  placeholder="e.g. +1 555-019-2831 or 555"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="input-control"
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ paddingInline: '1.5rem' }}
                >
                  <Search size={18} /> Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}>
            {errorMsg}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Searching reservations...
          </div>
        ) : searched && bookings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
              No bookings found for "{phoneNumber}"
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Please check the phone number or proceed to book a new court.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map((b) => (
              <div key={b._id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      #{b.bookingId}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '0.5rem' }}>
                      {b.courtName}
                    </h3>
                  </div>
                  <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : b.status === 'cancelled' ? 'badge-red' : 'badge-blue'}`}>
                    {b.status}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-color)',
                  marginBottom: '1rem',
                }}>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} color="var(--primary)" />
                    <span><strong>Date:</strong> {b.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} color="var(--primary)" />
                    <span><strong>Time:</strong> {b.startTime} - {b.endTime}</span>
                  </div>
                  <div>
                    <span><strong>Total:</strong> {currencySymbol}{b.price}</span>
                  </div>
                </div>

                {b.status === 'confirmed' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    >
                      <XCircle size={14} /> Cancel Reservation
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingLookupPage;
