import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import * as bookingController from './booking.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', bookingController.create);
router.get('/farmer', bookingController.getFarmerBookings);
router.get('/owner', bookingController.getOwnerBookings);
router.patch('/:id/status', bookingController.updateStatus);

export default router;
