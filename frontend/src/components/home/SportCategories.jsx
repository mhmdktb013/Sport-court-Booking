import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { useVenue } from '../../context/VenueContext';
import { courtService } from '../../services/api';

const defaultCategories = [
  { id: 'football', name: 'Football', icon: '⚽', color: '#10b981' },
  { id: 'padel', name: 'Padel', icon: '🎾', color: '#3b82f6' },
  { id: 'tennis', name: 'Tennis', icon: '🎾', color: '#f97316' },
  { id: 'basketball', name: 'Basketball', icon: '🏀', color: '#a855f7' },
];

const SportCategories = () => {
  const navigate = useNavigate();
  const { setSelectedSport } = useBooking();
  const { venue } = useVenue();
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await courtService.getCourts('all', venue?.venueId);
        if (res.data.success) {
          setCourts(res.data.courts);
        }
      } catch (err) {
        console.error('Failed to load courts for categories:', err);
      }
    };
    fetchCourts();
  }, [venue?.venueId]);

  const handleSelectSport = (sportId) => {
    setSelectedSport(sportId);
    navigate(`/booking?sport=${sportId}`);
  };

  const getSportCountText = (sportId) => {
    const matchCount = courts.filter((c) => c.sportType === sportId).length;
    if (matchCount === 0) return 'Available for Booking';
    return `${matchCount} Court${matchCount > 1 ? 's' : ''} Available`;
  };

  return (
    <section style={{ padding: '4rem 0', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Explore Sports
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#fff' }}>
            Choose Your Sport
          </h2>
        </div>

        <div className="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-4 gap-4">
          {defaultCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectSport(cat.id)}
              className="card"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {getSportCountText(cat.id)}
                </p>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: 600 }}>
                Book Slot →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SportCategories;
