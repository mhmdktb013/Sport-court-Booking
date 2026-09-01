import express from 'express';
import {
  getCourts,
  getFeaturedCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
} from '../controllers/courtController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCourts).post(protect, adminOnly, createCourt);
router.route('/featured').get(getFeaturedCourts);
router
  .route('/:id')
  .get(getCourtById)
  .put(protect, adminOnly, updateCourt)
  .delete(protect, adminOnly, deleteCourt);

export default router;
