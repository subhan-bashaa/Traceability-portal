import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

async function runSeed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }

  const isNeon =
    databaseUrl.includes('neon.tech') ||
    databaseUrl.includes('sslmode=require') ||
    process.env.DATABASE_SSL === 'true';

  console.log(`Connecting to NeonDB to insert real traceability records...`);
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: isNeon ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 20000,
  });

  try {
    const client = await pool.connect();
    console.log('✓ Connected to NeonDB.');

    const sqlPath = path.join(__dirname, 'seed_real_traceability.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing seed_real_traceability.sql...');
    await client.query(sql);

    console.log('✓ Successfully inserted real traceability records into NeonDB!');

    const [productsCount, componentsCount, routeCount, defectsCount, inspectionsCount, shipmentsCount] = await Promise.all([
      client.query('SELECT count(*) FROM products;'),
      client.query('SELECT count(*) FROM components;'),
      client.query('SELECT count(*) FROM route_logs;'),
      client.query('SELECT count(*) FROM defects;'),
      client.query('SELECT count(*) FROM inspections;'),
      client.query('SELECT count(*) FROM shipments;'),
    ]);

    console.log('\n--- NeonDB Live Record Summary ---');
    console.log(`• Products:    ${productsCount.rows[0].count}`);
    console.log(`• Components:  ${componentsCount.rows[0].count}`);
    console.log(`• Route Logs:  ${routeCount.rows[0].count}`);
    console.log(`• Defects:     ${defectsCount.rows[0].count}`);
    console.log(`• Inspections: ${inspectionsCount.rows[0].count}`);
    console.log(`• Shipments:   ${shipmentsCount.rows[0].count}`);
    console.log('----------------------------------\n');

    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Failed to run seed script:', err.message);
    await pool.end();
    process.exit(1);
  }
}

runSeed();
