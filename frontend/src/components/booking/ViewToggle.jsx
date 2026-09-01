import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

const ViewToggle = () => {
  const { viewMode, setViewMode } = useBooking();

  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: '3px',
      gap: '3px',
    }}>
      <button
        onClick={() => setViewMode('grid')}
        className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
        style={{
          border: 'none',
          padding: '0.4rem 0.85rem',
          fontSize: '0.8125rem',
          background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
          color: viewMode === 'grid' ? '#042f2e' : 'var(--text-muted)',
        }}
      >
        <LayoutGrid size={15} /> Grid Matrix
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
        style={{
          border: 'none',
          padding: '0.4rem 0.85rem',
          fontSize: '0.8125rem',
          background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
          color: viewMode === 'list' ? '#042f2e' : 'var(--text-muted)',
        }}
      >
        <List size={15} /> By Court
      </button>
    </div>
  );
};

export default ViewToggle;
