import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Agricultural Equipment Rental Platform Backend`);
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`OTP Provider: ${env.OTP_PROVIDER} (Default Dev OTP: ${env.DEFAULT_DEV_OTP})`);
  console.log(`==================================================\n`);
});
