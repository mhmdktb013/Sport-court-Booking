import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { venueService } from '../services/api';

const VenueContext = createContext();

export const useVenue = () => {
  const context = useContext(VenueContext);
  if (!context) {
    throw new Error('useVenue must be used within a VenueProvider');
  }
  return context;
};

const DEFAULT_VENUE_SLUG = 'chocair-arena';
// Versioned key so any legacy cached tenant from previous builds is discarded
const VENUE_CACHE_KEY = 'venue_cache_v2';

const readUrlSlug = () => {
  const params = new URLSearchParams(window.location.search);
  return (params.get('venue') || params.get('v') || params.get('slug') || '').toLowerCase().trim();
};

// Cache is only trusted when it matches the venue the URL asks for
const getCachedVenue = () => {
  try {
    localStorage.removeItem('active_venue_cache');
    const slugParam = readUrlSlug();
    const cached = localStorage.getItem(VENUE_CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (slugParam) {
      return parsed.slug === slugParam || parsed.subdomain === slugParam ? parsed : null;
    }
    return parsed.slug === DEFAULT_VENUE_SLUG ? parsed : null;
  } catch (e) {
    return null;
  }
};

const cacheVenue = (data) => {
  try {
    localStorage.setItem(VENUE_CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    // storage unavailable, ignore
  }
};

export const VenueProvider = ({ children }) => {
  const [venue, setVenue] = useState(getCachedVenue);
  const [loading, setLoading] = useState(!venue);
  const [resolved, setResolved] = useState(false);
  const [error, setError] = useState(null);

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
        document.title = `${venue.name} — Court Bookings`;
      }
    }
  }, [venue]);

  // Fetch venue settings from API based on strict priority:
  // 1. Custom domain / Hostname
  // 2. Subdomain
  // 3. ?venue=slug (URL Query Parameter always takes priority over cache & default)
  // 4. Chocair Arena (Default Fallback)
  const fetchVenueSettings = useCallback(async () => {
    try {
      // Check URL parameters first (URL IS THE ABSOLUTE SOURCE OF TRUTH)
      const params = new URLSearchParams(window.location.search);
      const slugParam = (params.get('venue') || params.get('v') || params.get('slug') || '').trim();
      const venueIdParam = (params.get('venueId') || '').trim();
      const host = window.location.hostname;
      const pathname = window.location.pathname;

      // If on /admin page and no explicit public slug in URL, allow logged in admin venue settings
      const token = localStorage.getItem('sportszone_token');
      if (pathname.startsWith('/admin') && !slugParam && token) {
        try {
          const response = await venueService.getVenueSettings();
          if (response.data.venue) {
            setVenue(response.data.venue);
            cacheVenue(response.data.venue);
            setError(null);
            return;
          }
        } catch (adminErr) {
          console.warn('Admin venue settings fetch fallback:', adminErr.message);
        }
      }

      // Public venue resolution via resolve endpoint
      const resolveParams = {};
      if (venueIdParam) resolveParams.venueId = venueIdParam;
      if (slugParam) resolveParams.slug = slugParam;
      if (host && host !== 'localhost' && host !== '127.0.0.1') resolveParams.host = host;

      const response = await venueService.resolveVenue(resolveParams);
      if (response.data.venue) {
        setVenue(response.data.venue);
        cacheVenue(response.data.venue);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load venue settings');
      console.error('Venue fetch error:', err);
    } finally {
      setResolved(true);
      setLoading(false);
    }
  }, []);

  // Update venue settings (Admin)
  const updateVenue = async (updates) => {
    try {
      setLoading(true);
      const response = await venueService.updateVenueSettings(updates);
      setVenue(response.data.venue);
      cacheVenue(response.data.venue);
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

  // Load venue settings on mount and listen to popstate/URL changes
  useEffect(() => {
    fetchVenueSettings();

    const handleLocationChange = () => {
      fetchVenueSettings();
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [fetchVenueSettings]);

  const value = {
    venue,
    loading,
    resolved,
    error,
    fetchVenueSettings,
    updateVenue,
  };

  return (
    <VenueContext.Provider value={value}>{children}</VenueContext.Provider>
  );
};

export default VenueContext;
