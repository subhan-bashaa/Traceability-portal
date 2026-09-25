import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

async function clearDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }

  const isNeon =
    databaseUrl.includes('neon.tech') ||
    databaseUrl.includes('sslmode=require') ||
    process.env.DATABASE_SSL === 'true';

  console.log(`Connecting to database to clear demo data...`);
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: isNeon ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 25000,
  });

  try {
    const client = await pool.connect();
    console.log('✓ Connected to NeonDB.');

    console.log('Truncating all tables and resetting identity sequences...');
    await client.query(`
      TRUNCATE TABLE shipments, inspections, reworks, defects, route_logs, operators, stations, components, products RESTART IDENTITY CASCADE;
    `);

    console.log('✓ All demo data has been successfully removed from NeonDB.');

    const res = await client.query('SELECT count(*) FROM products;');
    console.log(`Current products count: ${res.rows[0].count}`);

    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Failed to clear database:', err.message);
    await pool.end();
    process.exit(1);
  }
}

clearDatabase();
