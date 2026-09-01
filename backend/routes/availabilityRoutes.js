import express from 'express';
import { getAvailability } from '../controllers/availabilityController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(optionalProtect, getAvailability);

export default router;
