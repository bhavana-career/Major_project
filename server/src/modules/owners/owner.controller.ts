import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import * as ownerService from './owner.service.js';

export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const profile = await ownerService.getOwnerProfile(req.user!.userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const updated = await ownerService.updateOwnerProfile(req.user!.userId, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const stats = await ownerService.getOwnerDashboardStats(req.user!.userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}
