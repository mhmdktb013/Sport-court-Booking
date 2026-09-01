import React from 'react';
import { useSearchParams } from 'react-router-dom';
import DateBar from '../components/booking/DateBar';
import SportFilter from '../components/booking/SportFilter';
import ViewToggle from '../components/booking/ViewToggle';
import CourtGridMatrix from '../components/booking/CourtGridMatrix';
import CourtCardList from '../components/booking/CourtCardList';
import MobileBookingExperience from '../components/booking/MobileBookingExperience';
import BookingModal from '../components/booking/BookingModal';
import BookingSuccessModal from '../components/booking/BookingSuccessModal';
import { useBooking } from '../context/BookingContext';
import { Sparkles, Info, RefreshCw } from 'lucide-react';

const BookingPage = () => {
  const {
    availability,
    loading,
    error,
    viewMode,
    selectedSport,
    setSelectedSport,
    fetchAvailability,
  } = useBooking();

  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const sportParam = searchParams.get('sport');
    if (sportParam) {
      setSelectedSport(sportParam);
    }
  }, [searchParams, setSelectedSport]);

  return (
    <div style={{ padding: '2rem 0 5rem 0' }}>
      <div className="container">
        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

        {/* Global Loading Indicator */}
        {loading ? (
          <div style={{
            padding: '5rem 0',
            textAlign: 'center',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            margin: '1.5rem 0',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-color)',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem auto',
            }}>
              <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              `}</style>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Fetching live court availability...
            </p>
          </div>
        ) : (
          <>
            {/* =======================================================
                1. MOBILE BOOKING EXPERIENCE (Max Width 768px)
                Clean vertical time-slots list with [ 7 ] / [ FULL ] badges
                and expandable court drawer.
               ======================================================= */}
            <div className="mobile-only-booking-view">
              <MobileBookingExperience availabilityData={availability} />
            </div>

            {/* =======================================================
                2. DESKTOP BOOKING EXPERIENCE (Min Width 769px)
                Traditional full court-by-time grid matrix & controls.
               ======================================================= */}
            <div className="desktop-only-booking-view">
              {/* Page Top Header */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '2rem',
                gap: '1rem',
              }}>
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--primary)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.35rem',
                  }}>
                    <Sparkles size={14} /> Live Availability & Match Booking
                  </div>
                  <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                    Find Your Court
                  </h1>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Select a date, pick your preferred sport, and choose an open slot to book instantly.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <ViewToggle />
                  <button
                    onClick={() => fetchAvailability()}
                    className="btn btn-secondary btn-sm"
                    title="Refresh Availability"
                  >
                    <RefreshCw size={15} />
                  </button>
                </div>
              </div>

              {/* Date Selector Bar (14 Days) */}
              <DateBar />

              {/* Sport Filter Tabs */}
              <div style={{ marginBottom: '1.5rem' }}>
                <SportFilter />
              </div>

              {/* Availability Legend */}
              <div className="availability-legend">
                <div className="legend-item">
                  <span className="legend-indicator available"></span>
                  <span>Available (Click to Book)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-indicator booked"></span>
                  <span>Booked</span>
                </div>
                <div className="legend-item">
                  <span className="legend-indicator blocked"></span>
                  <span>Maintenance / Reserved</span>
                </div>
                <div className="legend-item">
                  <span className="legend-indicator past"></span>
                  <span>Past Time Slot</span>
                </div>
              </div>

              {/* Desktop Grid or List View */}
              <div>
                {viewMode === 'grid' ? (
                  <CourtGridMatrix availabilityData={availability} />
                ) : (
                  <CourtCardList availabilityData={availability} />
                )}
              </div>
            </div>
          </>
        )}

        {/* Step 4 & Confirmation Modals */}
        <BookingModal />
        <BookingSuccessModal />
      </div>
    </div>
  );
};

export default BookingPage;
