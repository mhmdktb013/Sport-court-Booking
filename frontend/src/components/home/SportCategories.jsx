import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';

const categories = [
  {
    id: 'football',
    name: 'Football',
    count: '2 Pitches (7v7 & 5v5)',
    icon: '⚽',
    tag: 'FIFA AstroTurf',
    color: '#10b981',
  },
  {
    id: 'padel',
    name: 'Padel',
    count: '2 Courts (Indoor & Outdoor)',
    icon: '🎾',
    tag: 'Panoramic Glass',
    color: '#3b82f6',
  },
  {
    id: 'tennis',
    name: 'Tennis',
    count: '2 Courts (Clay & Hardcourt)',
    icon: '🎾',
    tag: 'Championship Surface',
    color: '#f97316',
  },
  {
    id: 'basketball',
    name: 'Basketball',
    count: '1 Main Indoor Arena',
    icon: '🏀',
    tag: 'FIBA Hardwood',
    color: '#a855f7',
  },
];

const SportCategories = () => {
  const navigate = useNavigate();
  const { setSelectedSport } = useBooking();

  const handleSelectSport = (sportId) => {
    setSelectedSport(sportId);
    navigate(`/booking?sport=${sportId}`);
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
          {categories.map((cat) => (
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '2.25rem', lineHeight: 1 }}>{cat.icon}</span>
                <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                  {cat.tag}
                </span>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {cat.count}
                </p>
              </div>

              <div style={{
                marginTop: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span>Check Slots</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SportCategories;
