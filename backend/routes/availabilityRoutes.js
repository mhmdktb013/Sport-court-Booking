import express from 'express';
import { getAvailability } from '../controllers/availabilityController.js';

const router = express.Router();

router.route('/').get(getAvailability);

export default router;
