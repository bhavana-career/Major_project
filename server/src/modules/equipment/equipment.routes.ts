import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import * as equipmentController from './equipment.controller.js';

const router = Router();

// Public / Search endpoints
router.get('/', equipmentController.search);
router.get('/my-equipment', authenticate, equipmentController.getMyEquipment);
router.get('/:id', equipmentController.getById);

// Owner protected endpoints
router.post('/', authenticate, equipmentController.create);
router.put('/:id', authenticate, equipmentController.update);
router.patch('/:id/status', authenticate, equipmentController.toggleStatus);

export default router;
