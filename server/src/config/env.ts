import dotenv from 'dotenv';
import path from 'path';

// Load .env file from root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'agri_rental_jwt_secret_dev_2026',
  OTP_PROVIDER: process.env.OTP_PROVIDER || 'development',
  DEFAULT_DEV_OTP: process.env.DEFAULT_DEV_OTP || '123456',
};
