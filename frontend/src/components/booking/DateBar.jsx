import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

const DateBar = () => {
  const { selectedDate, setSelectedDate } = useBooking();

  // Helper to format date strings
  const formatDateObj = (d) => {
    return d.toISOString().split('T')[0];
  };

  // Generate 14 day pills starting from today or current date
  const generateDatePills = () => {
    const pills = [];
    const base = new Date();
    
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const dateStr = formatDateObj(d);

      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });

      pills.push({
        dateStr,
        dayName,
        dayNum,
        monthName,
        isToday: i === 0,
      });
    }
    return pills;
  };

  const pills = generateDatePills();

  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Don't go before today
    if (current >= today) {
      setSelectedDate(formatDateObj(current));
    }
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    setSelectedDate(formatDateObj(current));
  };

  const isSelectedDateToday = selectedDate === formatDateObj(new Date());

  const readableSelectedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Date Bar Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        gap: '0.75rem',
      }}>
        <div className="flex items-center gap-3">
          <CalendarIcon size={20} color="var(--primary)" />
          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Selected Date</span>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fff' }}>
              {readableSelectedDate}
            </div>
          </div>
        </div>

        {/* Date Controls & Native Picker */}
        <div className="flex items-center gap-2">
          {!isSelectedDateToday && (
            <button
              onClick={() => setSelectedDate(formatDateObj(new Date()))}
              className="btn btn-secondary btn-sm"
            >
              Jump to Today
            </button>
          )}

          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={selectedDate}
              min={formatDateObj(new Date())}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="input-control"
              style={{
                padding: '0.4rem 0.75rem',
                fontSize: '0.8125rem',
                colorScheme: 'dark',
                cursor: 'pointer',
              }}
            />
          </div>

          <button
            onClick={handlePrevDay}
            disabled={isSelectedDateToday}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem', opacity: isSelectedDateToday ? 0.4 : 1 }}
            title="Previous Day"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNextDay}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem' }}
            title="Next Day"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 14-Day Horizontal Scrollable Pills */}
      <div className="date-selector-bar">
        {pills.map((pill) => {
          const isSelected = pill.dateStr === selectedDate;
          return (
            <div
              key={pill.dateStr}
              onClick={() => setSelectedDate(pill.dateStr)}
              className={`date-pill ${isSelected ? 'active' : ''}`}
            >
              <span className="day-name">{pill.dayName}</span>
              <span className="day-number">{pill.dayNum}</span>
              <span className="month-name">{pill.monthName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DateBar;
