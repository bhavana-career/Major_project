import { Router } from 'express';
import { authenticate, authorizeRole } from '../../middleware/auth.js';
import * as farmerController from './farmer.controller.js';

const router = Router();

router.use(authenticate);

router.get('/profile', farmerController.getProfile);
router.put('/profile', farmerController.updateProfile);
router.post('/farms', farmerController.addFarm);

export default router;
