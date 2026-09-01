import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Sparkles, Clock } from 'lucide-react';
import { courtService } from '../../services/api';
import { useBooking } from '../../context/BookingContext';
import { useVenue } from '../../context/VenueContext';

const FeaturedCourts = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setSelectedSport } = useBooking();
  const { venue } = useVenue();
  const currencySymbol = venue?.currencySymbol || '$';

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await courtService.getFeaturedCourts(venue?.venueId);
        if (res.data.success) {
          setCourts(res.data.courts);
        }
      } catch (err) {
        console.error('Error fetching featured courts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, [venue?.venueId]);

  const handleBookCourt = (court) => {
    setSelectedSport(court.sportType);
    const venueQuery = venue?.slug && venue.slug !== 'chocair-arena' ? `&venue=${venue.slug}` : '';
    navigate(`/booking?sport=${court.sportType}${venueQuery}`);
  };

  const getSportBadgeColor = (sport) => {
    switch (sport) {
      case 'football': return 'badge-green';
      case 'padel': return 'badge-blue';
      case 'tennis': return 'badge-orange';
      case 'basketball': return 'badge-purple';
      default: return 'badge-gray';
    }
  };

  return (
    <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2.5rem',
          gap: '1rem',
        }}>
          <div>
            <span style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              Facility Highlights
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#fff' }}>
              Featured Sports Courts
            </h2>
          </div>
          <button onClick={() => navigate('/booking')} className="btn btn-outline btn-sm">
            View Live Schedule & All Courts →
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading courts...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-3 gap-6">
            {courts.map((court) => (
              <div key={court._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Court Image Banner */}
                <div style={{ position: 'relative', height: '210px', background: '#1c2438', overflow: 'hidden' }}>
                  <img
                    src={court.images?.[0] || 'https://images.unsplash.com/photo-1529900245534-47fbfb57835a?auto=format&fit=crop&w=800&q=80'}
                    alt={court.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '0.5rem',
                  }}>
                    <span className={`badge ${getSportBadgeColor(court.sportType)}`}>
                      {court.sportType}
                    </span>
                    <span className="badge badge-gray">
                      {court.environment}
                    </span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(9, 13, 22, 0.88)',
                    backdropFilter: 'blur(6px)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: 'var(--primary)',
                  }}>
                    {currencySymbol}{court.pricePerHour}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>/hr</span>
                  </div>
                </div>

                {/* Court Details */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                    {court.name}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5, flex: 1 }}>
                    {court.description || `${court.surface} with professional lighting and amenities.`}
                  </p>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1.25rem',
                    padding: '0.75rem',
                    background: '#0d131f',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}>
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} color="var(--primary)" />
                      <span><strong>Surface:</strong> {court.surface}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} color="var(--primary)" />
                      <span><strong>Hours:</strong> {court.openingTime} – {court.closingTime}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookCourt(court)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    <Calendar size={16} /> Book This Court
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourts;
