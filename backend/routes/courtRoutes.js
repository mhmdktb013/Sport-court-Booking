import express from 'express';
import {
  getCourts,
  getFeaturedCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
} from '../controllers/courtController.js';
import { protect, optionalProtect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(optionalProtect, getCourts).post(protect, adminOnly, createCourt);
router.route('/featured').get(optionalProtect, getFeaturedCourts);
router
  .route('/:id')
  .get(optionalProtect, getCourtById)
  .put(protect, adminOnly, updateCourt)
  .delete(protect, adminOnly, deleteCourt);

export default router;
