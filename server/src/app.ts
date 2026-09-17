import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import farmerRoutes from './modules/farmers/farmer.routes.js';
import ownerRoutes from './modules/owners/owner.routes.js';
import equipmentRoutes from './modules/equipment/equipment.routes.js';
import bookingRoutes from './modules/bookings/booking.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Agricultural Equipment Rental Platform API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);

// Central error handler
app.use(errorHandler);

export default app;
