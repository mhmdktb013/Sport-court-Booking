import React from 'react';
import { useBooking } from '../../context/BookingContext';

const sports = [
  { id: 'all', label: 'All Sports', icon: '🏆' },
  { id: 'football', label: 'Football', icon: '⚽' },
  { id: 'padel', label: 'Padel', icon: '🎾' },
  { id: 'tennis', label: 'Tennis', icon: '🎾' },
  { id: 'basketball', label: 'Basketball', icon: '🏀' },
];

const SportFilter = () => {
  const { selectedSport, setSelectedSport } = useBooking();

  return (
    <div className="sport-tabs">
      {sports.map((sport) => {
        const isActive = selectedSport === sport.id;
        return (
          <button
            key={sport.id}
            onClick={() => setSelectedSport(sport.id)}
            className={`sport-tab-btn ${isActive ? 'active' : ''}`}
          >
            <span>{sport.icon}</span>
            <span>{sport.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SportFilter;
