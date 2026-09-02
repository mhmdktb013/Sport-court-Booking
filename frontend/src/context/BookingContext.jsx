import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { availabilityService } from '../services/api';
import { useVenue } from './VenueContext';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const { venue } = useVenue();

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [selectedSport, setSelectedSport] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Booking Modal State
  const [selectedSlot, setSelectedSlot] = useState(null); // { court, slot, date }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Venue/sport can change while a request is in flight; only the newest wins
  const requestIdRef = useRef(0);

  const fetchAvailability = useCallback(async (date = selectedDate, sport = selectedSport, vId = venue?.venueId) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await availabilityService.getAvailability(date, sport, vId);
      if (requestId !== requestIdRef.current) return;
      if (res.data.success) {
        setAvailability(res.data);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error('Error fetching availability:', err);
      setError(err.response?.data?.message || 'Failed to fetch court availability');
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [selectedDate, selectedSport, venue?.venueId]);

  useEffect(() => {
    fetchAvailability(selectedDate, selectedSport, venue?.venueId);
  }, [selectedDate, selectedSport, venue?.venueId, fetchAvailability]);

  const selectSlotForBooking = (court, slot) => {
    if (slot.status !== 'available') return;
    setSelectedSlot({ court, slot, date: selectedDate });
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleBookingSuccess = (booking) => {
    setConfirmedBooking(booking);
    setIsModalOpen(false);
    setSelectedSlot(null);
    // Refresh availability matrix immediately
    fetchAvailability(selectedDate, selectedSport);
  };

  const closeSuccessModal = () => {
    setConfirmedBooking(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        selectedSport,
        setSelectedSport,
        viewMode,
        setViewMode,
        availability,
        loading,
        error,
        fetchAvailability,
        selectedSlot,
        selectSlotForBooking,
        isModalOpen,
        closeBookingModal,
        confirmedBooking,
        handleBookingSuccess,
        closeSuccessModal,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
