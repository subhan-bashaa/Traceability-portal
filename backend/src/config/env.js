import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fynd_traceability',
  DATABASE_SSL: process.env.DATABASE_SSL === 'true',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // AI Configuration
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

  AI_PRIMARY_PROVIDER: (process.env.AI_PRIMARY_PROVIDER || 'gemini').toLowerCase(),
  AI_SECONDARY_PROVIDER: (process.env.AI_SECONDARY_PROVIDER || 'groq').toLowerCase(),

  AI_CACHE_TTL: parseInt(process.env.AI_CACHE_TTL || '3600', 10),
  REDIS_URL: process.env.REDIS_URL || '',
};

export default env;
