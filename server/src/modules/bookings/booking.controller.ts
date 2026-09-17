import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import * as bookingService from './booking.service.js';

export async function create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { equipmentId, startDate, endDate, notes } = req.body;
    if (!equipmentId || !startDate || !endDate) {
      return res.status(400).json({ error: 'Equipment ID, start date, and end date are required.' });
    }

    const booking = await bookingService.createBooking(req.user!.userId, {
      equipmentId,
      startDate,
      endDate,
      notes,
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
}

export async function getFarmerBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const list = await bookingService.getFarmerBookings(req.user!.userId);
    res.json(list);
  } catch (error) {
    next(error);
  }
}

export async function getOwnerBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const list = await bookingService.getOwnerBookings(req.user!.userId);
    res.json(list);
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;
    if (!status || !['CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required (CONFIRMED, REJECTED, COMPLETED, CANCELLED).' });
    }

    const updated = await bookingService.updateBookingStatus(req.user!.userId, req.params.id, status);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}
