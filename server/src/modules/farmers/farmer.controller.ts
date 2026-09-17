import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import * as farmerService from './farmer.service.js';

export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const profile = await farmerService.getFarmerProfile(req.user!.userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const updated = await farmerService.updateFarmerProfile(req.user!.userId, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function addFarm(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const farm = await farmerService.addFarm(req.user!.userId, req.body);
    res.status(201).json(farm);
  } catch (error) {
    next(error);
  }
}
