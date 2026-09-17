import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

export async function sendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, purpose } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }
    const result = await authService.requestOtp(phone, purpose);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone number and OTP code are required.' });
    }
    const result = await authService.verifyOtp(phone, code);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, password, name, role, verificationToken, district, taluk, village, businessName, locationName } = req.body;
    if (!phone || !password || !name || !role) {
      return res.status(400).json({ error: 'Phone, password, name, and role are required.' });
    }
    const result = await authService.registerUser({
      phone,
      password,
      name,
      role,
      verificationToken,
      district,
      taluk,
      village,
      businessName,
      locationName,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone number and password are required.' });
    }
    const result = await authService.loginUser(phone, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    const user = await authService.getCurrentUser(req.user.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
}
