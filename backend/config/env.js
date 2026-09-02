import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Loaded here rather than in server.js because ES module imports are evaluated
// before the importing module's body runs.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const REQUIRED = ['JWT_SECRET'];
const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`❌ Missing required environment variable(s): ${missing.join(', ')}`);
  process.exit(1);
}

export const JWT_SECRET = process.env.JWT_SECRET;

// Stays false until the venue's own business SMS/WhatsApp sender is live.
// While false the OTP step is skipped entirely rather than faked.
export const OTP_ENFORCED = process.env.OTP_ENFORCED === 'true';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
