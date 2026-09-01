import axios from 'axios';

// Resolve base API endpoint (supports custom VITE_API_URL in production or local /api proxy in development)
const rawBaseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';
const apiBaseURL = rawBaseURL
  ? (rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL.replace(/\/+$/, '')}/api`)
  : '/api';

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sportszone_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const courtService = {
  getCourts: (sport = 'all', venueId) =>
    api.get('/courts', {
      params: {
        sport,
        ...(venueId ? { venueId } : {}),
      },
    }),
  getFeaturedCourts: (venueId) =>
    api.get('/courts/featured', {
      params: {
        ...(venueId ? { venueId } : {}),
      },
    }),
  getCourtById: (id) => api.get(`/courts/${id}`),
};

export const availabilityService = {
  getAvailability: (date, sport = 'all', venueId) =>
    api.get('/availability', {
      params: {
        date,
        sport,
        ...(venueId ? { venueId } : {}),
      },
    }),
};

export const bookingService = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getBookingDetails: (idOrCode) => api.get(`/bookings/${idOrCode}`),
  cancelBooking: (id, reason) => api.post(`/bookings/${id}/cancel`, { reason }),
  lookupByPhone: (phone) => api.get(`/bookings/lookup/phone?phone=${encodeURIComponent(phone)}`),
};

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  sendOtp: (phone) => api.post('/auth/otp/send', { phone }),
  verifyOtp: (phone, code) => api.post('/auth/otp/verify', { phone, code }),
};

export const adminService = {
  getMetrics: () => api.get('/admin/metrics'),
  getBookings: (params = {}) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id, status, cancellationReason) =>
    api.put(`/admin/bookings/${id}/status`, { status, cancellationReason }),
  getCalendar: (date, sport = 'all') =>
    api.get(`/admin/calendar?date=${date}&sport=${sport}`),
  blockSlot: (payload) => api.post('/admin/slots/block', payload),
  unblockSlot: (payload) => api.post('/admin/slots/unblock', payload),
  createCourt: (payload) => api.post('/courts', payload),
  updateCourt: (id, payload) => api.put(`/courts/${id}`, payload),
  deleteCourt: (id) => api.delete(`/courts/${id}`),
};

export const venueService = {
  resolveVenue: (params = {}) => api.get('/venues/resolve', { params }),
  getActiveVenue: () => api.get('/venues/active'),
  getVenueBySlug: (slug) => api.get(`/venues/${slug}`),
  getVenueSettings: () => api.get('/venues/admin/settings'),
  updateVenueSettings: (data) => api.put('/venues/admin/settings', data),
};

export default api;
