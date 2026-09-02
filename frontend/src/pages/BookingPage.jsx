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
import { RefreshCw } from 'lucide-react';

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
    <div className="bk-page">
      <div className="container bk-container">
        <div className="bk-page-head">
          <div>
            <h1 className="bk-title">Book a Court</h1>
            <p className="bk-subtitle">Pick a date, sport, and open slot.</p>
          </div>

          <div className="bk-head-actions">
            <ViewToggle />
            <button
              onClick={() => fetchAvailability()}
              className="btn btn-secondary btn-sm bk-refresh-btn"
              title="Refresh availability"
              aria-label="Refresh availability"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {error && <div className="bk-error">{error}</div>}

        {loading ? (
          <div className="bk-loading">
            <div className="bk-spinner" />
            <p>Loading availability…</p>
          </div>
        ) : (
          <>
            <div className="mobile-only-booking-view">
              <MobileBookingExperience availabilityData={availability} />
            </div>

            <div className="desktop-only-booking-view">
              <section className="bk-controls-panel">
                <DateBar />
                <div className="bk-controls-divider" />
                <SportFilter />
              </section>

              <div className="availability-legend">
                <div className="legend-item">
                  <span className="legend-indicator available"></span>
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <span className="legend-indicator booked"></span>
                  <span>Booked</span>
                </div>
                <div className="legend-item">
                  <span className="legend-indicator blocked"></span>
                  <span>Maintenance</span>
                </div>
                <div className="legend-item">
                  <span className="legend-indicator past"></span>
                  <span>Past</span>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <CourtGridMatrix availabilityData={availability} />
              ) : (
                <CourtCardList availabilityData={availability} />
              )}
            </div>
          </>
        )}

        <BookingModal />
        <BookingSuccessModal />
      </div>
    </div>
  );
};

export default BookingPage;
