import React, { createContext, useContext, useState, useEffect } from 'react';
import { venueService } from '../services/api';

const VenueContext = createContext();

export const useVenue = () => {
  const context = useContext(VenueContext);
  if (!context) {
    throw new Error('useVenue must be used within a VenueProvider');
  }
  return context;
};

export const VenueProvider = ({ children }) => {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch venue settings from API (Admin settings if authenticated, otherwise resolved venue by host/slug)
  const fetchVenueSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('sportszone_token');
      if (token) {
        try {
          const response = await venueService.getVenueSettings();
          if (response.data.venue) {
            setVenue(response.data.venue);
            setError(null);
            return;
          }
        } catch (adminErr) {
          console.warn('Admin venue settings fetch failed, falling back to public venue resolution:', adminErr.message);
        }
      }

      // Check URL parameters for explicit tenant slug or venueId override
      const params = new URLSearchParams(window.location.search);
      const slugParam = params.get('venue') || params.get('v') || params.get('slug');
      const venueIdParam = params.get('venueId');
      const host = window.location.hostname;

      const resolveParams = {};
      if (venueIdParam) resolveParams.venueId = venueIdParam;
      if (slugParam) resolveParams.slug = slugParam;
      if (host && host !== 'localhost' && host !== '127.0.0.1') resolveParams.host = host;

      const response = await venueService.resolveVenue(resolveParams);
      setVenue(response.data.venue);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load venue settings');
      console.error('Venue fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update venue settings
  const updateVenue = async (updates) => {
    try {
      setLoading(true);
      const response = await venueService.updateVenueSettings(updates);
      setVenue(response.data.venue);
      setError(null);
      return response.data.venue;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Failed to update venue settings';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load venue settings on mount
  useEffect(() => {
    fetchVenueSettings();
  }, []);

  // Apply theme colors and document title dynamically
  useEffect(() => {
    if (venue) {
      const root = document.documentElement;
      if (venue.primaryColor) {
        root.style.setProperty('--primary', venue.primaryColor);
        root.style.setProperty('--primary-glow', `${venue.primaryColor}4d`);
      }
      if (venue.secondaryColor) {
        root.style.setProperty('--secondary', venue.secondaryColor);
      }
      if (venue.accentColor) {
        root.style.setProperty('--accent', venue.accentColor);
      }
      if (venue.name) {
        document.title = `${venue.name} — Sports Arena & Court Bookings`;
      }
    }
  }, [venue]);

  const value = {
    venue,
    loading,
    error,
    fetchVenueSettings,
    updateVenue,
  };

  return (
    <VenueContext.Provider value={value}>{children}</VenueContext.Provider>
  );
};

export default VenueContext;
