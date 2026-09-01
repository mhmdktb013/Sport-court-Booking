import express from 'express';
import {
  resolveVenue,
  getActiveVenue,
  getVenueBySlug,
  getVenueSettings,
  updateVenueSettings,
  createVenue,
  getAllVenues,
  deleteVenue,
} from '../controllers/venueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin endpoints (requires auth) - MUST be defined before /:slug to avoid route collision
router.get('/admin/settings', protect, getVenueSettings);
router.put('/admin/settings', protect, updateVenueSettings);

// Public endpoints
router.get('/resolve', resolveVenue);
router.get('/active', getActiveVenue);
router.get('/:slug', getVenueBySlug);

// Super Admin endpoints
router.post('/', protect, createVenue);
router.get('/', protect, getAllVenues);
router.delete('/:venueId', protect, deleteVenue);

export default router;
