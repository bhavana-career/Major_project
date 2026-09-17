import { env } from '../config/env.js';

export function generateOtp(): string {
  // In development mode, return standard test OTP (e.g. "123456") or random 6-digit number
  if (env.NODE_ENV === 'development') {
    return env.DEFAULT_DEV_OTP || '123456';
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function sendDevOtp(phone: string, otp: string) {
  console.log(`\n==================================================`);
  console.log(`[DEVELOPMENT OTP PROVIDER]`);
  console.log(`Phone Number: ${phone}`);
  console.log(`Verification OTP Code: ${otp}`);
  console.log(`(This simulated OTP is printed for Review 1 demo)`);
  console.log(`==================================================\n`);
}
