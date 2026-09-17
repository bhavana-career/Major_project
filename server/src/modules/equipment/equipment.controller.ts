import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import * as equipmentService from './equipment.service.js';

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const { query, equipmentType, locationName, minPrice, maxPrice, startDate, endDate, lat, lon } = req.query;

    const list = await equipmentService.searchEquipment({
      query: query as string,
      equipmentType: equipmentType as string,
      locationName: locationName as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      startDate: startDate as string,
      endDate: endDate as string,
      farmerLat: lat ? Number(lat) : undefined,
      farmerLon: lon ? Number(lon) : undefined,
    });

    res.json(list);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await equipmentService.getEquipmentById(req.params.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const item = await equipmentService.createEquipment(req.user!.userId, req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const updated = await equipmentService.updateEquipment(req.user!.userId, req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function toggleStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { isActive } = req.body;
    const updated = await equipmentService.toggleEquipmentStatus(req.user!.userId, req.params.id, Boolean(isActive));
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function getMyEquipment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const list = await equipmentService.getOwnedEquipment(req.user!.userId);
    res.json(list);
  } catch (error) {
    next(error);
  }
}
