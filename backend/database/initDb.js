import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

async function initDatabase() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    'postgresql://neondb_owner:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require';

  const isNeon =
    databaseUrl.includes('neon.tech') ||
    databaseUrl.includes('sslmode=require') ||
    process.env.DATABASE_SSL === 'true';

  console.log('==================================================');
  console.log(`  🚀 INITIALIZING ${isNeon ? 'NEON DB (SERVERLESS POSTGRES)' : 'POSTGRESQL'}`);
  console.log('==================================================');
  console.log(`Endpoint: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`SSL Mode: ${isNeon ? 'REQUIRED (rejectUnauthorized: false)' : 'DISABLED'}`);

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: isNeon ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 15000,
  });

  try {
    const client = await pool.connect();
    const ver = await client.query('SELECT version()');
    console.log(`✓ Connected successfully. Engine: ${ver.rows[0]?.version?.split(' ')[0]} ${ver.rows[0]?.version?.split(' ')[1]}`);

    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    console.log('\n[1/2] Applying database schema (9 tables & indexes)...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('✓ Schema applied successfully.');

    console.log('\n[2/2] Inserting seed data (Products SN-2026-001245 & SN-2026-001246)...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await client.query(seedSql);
    console.log('✓ Seed data inserted successfully.');

    // Quick verification count
    const countRes = await client.query('SELECT count(*) FROM products');
    console.log(`✓ Verified: ${countRes.rows[0].count} product records loaded in NeonDB.`);

    client.release();
    await pool.end();
    console.log('\n==================================================');
    console.log('  ✨ NEON DB INITIALIZATION COMPLETE!');
    console.log('==================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error(`Error: ${error.message}`);
    if (error.code === 'ECONNREFUSED' || error.code === '28P01' || error.code === '3D000') {
      console.error('\nTroubleshooting NeonDB:');
      console.error('1. Verify your DATABASE_URL in backend/.env has the format:');
      console.error('   postgresql://neondb_owner:password@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require');
      console.error('2. Ensure the Neon compute endpoint is not paused (Neon automatically resumes upon connection).');
    }
    await pool.end();
    process.exit(1);
  }
}

initDatabase();
