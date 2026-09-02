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
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bk-datebar">
      <div className="bk-datebar-top">
        <div className="bk-datebar-current">
          <CalendarIcon size={16} color="var(--primary)" />
          <span>{readableSelectedDate}</span>
        </div>

        <div className="bk-datebar-actions">
          {!isSelectedDateToday && (
            <button
              onClick={() => setSelectedDate(formatDateObj(new Date()))}
              className="btn btn-secondary btn-sm"
            >
              Today
            </button>
          )}

          <input
            type="date"
            value={selectedDate}
            min={formatDateObj(new Date())}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="input-control bk-date-input"
            aria-label="Pick a date"
          />

          <button
            onClick={handlePrevDay}
            disabled={isSelectedDateToday}
            className="btn btn-secondary btn-sm bk-icon-btn"
            title="Previous day"
            aria-label="Previous day"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextDay}
            className="btn btn-secondary btn-sm bk-icon-btn"
            title="Next day"
            aria-label="Next day"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="date-selector-bar">
        {pills.map((pill) => {
          const isSelected = pill.dateStr === selectedDate;
          return (
            <button
              key={pill.dateStr}
              onClick={() => setSelectedDate(pill.dateStr)}
              className={`date-pill ${isSelected ? 'active' : ''}`}
            >
              <span className="day-name">{pill.dayName}</span>
              <span className="day-number">{pill.dayNum}</span>
              <span className="month-name">{pill.monthName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateBar;
