import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import * as ownerController from './owner.controller.js';

const router = Router();

router.use(authenticate);

router.get('/profile', ownerController.getProfile);
router.put('/profile', ownerController.updateProfile);
router.get('/dashboard', ownerController.getDashboard);

export default router;
