import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

// Detect if connecting to Neon Serverless PostgreSQL
export const isNeonDatabase =
  Boolean(env.DATABASE_URL) &&
  (env.DATABASE_URL.includes('neon.tech') ||
   env.DATABASE_URL.includes('sslmode=require') ||
   env.DATABASE_SSL);

// Detect if the user hasn't replaced the placeholder connection string yet
export const isSamplePlaceholder =
  Boolean(env.DATABASE_URL) &&
  (env.DATABASE_URL.includes('ep-sample-pooler') ||
   env.DATABASE_URL.includes('password@') ||
   env.DATABASE_URL.includes('postgres:postgres@localhost'));

/**
 * Configure standard pg.Pool with SSL for NeonDB.
 * In Node.js Express environments, node-postgres connects reliably to Neon
 * with SSL rejectUnauthorized: false.
 */
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: isNeonDatabase || env.DATABASE_SSL ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: (process.env.NODE_ENV === 'test' || isSamplePlaceholder) ? 1000 : 8000,
});

pool.on('error', (err) => {
  // Prevent unhandled error crashes from idle pool errors
  console.warn('Database pool idle notice:', err.message);
});

/**
 * Helper to determine if an error is a database connectivity/configuration issue
 */
export function isConnectionError(err) {
  if (!err) return false;
  return (
    err.code === 'ECONNREFUSED' ||
    err.code === 'ENOTFOUND' ||
    err.code === '28P01' || // invalid credentials on dummy/unconfigured URL
    err.code === '3D000' || // database does not exist
    err.code === 'ETIMEDOUT' ||
    err.message?.includes('connect') ||
    err.message?.includes('authentication failed') ||
    err.message?.includes('timeout')
  );
}

/**
 * Execute parameterized query
 * Enforces parameterization: NEVER concatenate user input into SQL
 */
export async function query(text, params) {
  // Fast fail in test suites if using sample placeholder to avoid 5-second internet timeouts
  if (isSamplePlaceholder && process.env.NODE_ENV === 'test') {
    const error = new Error('Database is offline (placeholder URL in test environment)');
    error.code = 'ECONNREFUSED';
    throw error;
  }

  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;

  if (env.NODE_ENV === 'development') {
    if (duration > 150) {
      console.warn(`[SLOW QUERY] ${text} [${duration}ms]`);
    }
  }

  return res;
}

/**
 * Health check ping for database connectivity
 */
export async function checkDbConnection() {
  if (isSamplePlaceholder && process.env.NODE_ENV === 'test') {
    return {
      connected: false,
      provider: isNeonDatabase ? 'NeonDB Serverless' : 'PostgreSQL',
      error: 'Unconfigured placeholder URL (test mode)',
    };
  }

  try {
    const client = await pool.connect();
    const res = await client.query('SELECT 1 as connected, version()');
    client.release();
    return {
      connected: true,
      provider: isNeonDatabase ? 'NeonDB Serverless' : 'PostgreSQL',
      version: res.rows[0]?.version || 'Unknown',
    };
  } catch (error) {
    return {
      connected: false,
      provider: isNeonDatabase ? 'NeonDB Serverless' : 'PostgreSQL',
      error: error.message,
    };
  }
}

export default {
  pool,
  query,
  checkDbConnection,
  isNeonDatabase,
  isSamplePlaceholder,
  isConnectionError,
};
