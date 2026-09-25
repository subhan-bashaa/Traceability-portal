import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function autoMigrateIfEmpty() {
  try {
    // 1. Check if products table exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `;
    const res = await pool.query(checkTableQuery);
    const productsExist = res.rows[0]?.exists;

    // 2. Check if users table exists
    const checkUsersQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    const usersRes = await pool.query(checkUsersQuery);
    const usersExist = usersRes.rows[0]?.exists;

    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    const seedPath = path.resolve(__dirname, '../../database/seed.sql');

    if (!productsExist || !usersExist) {
      console.log('🔄 [Auto-Migrate] Missing tables detected. Running initial database setup...');

      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSql);
        console.log('✓ [Auto-Migrate] Schema applied successfully (users, products, components, etc.).');
      }

      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await pool.query(seedSql);
        console.log('✓ [Auto-Migrate] Initial seed data inserted.');
      }
    } else {
      console.log('✓ [Auto-Migrate] Core tables verified (products, users, etc. present).');
    }
  } catch (err) {
    console.error('⚠️ [Auto-Migrate] Notice:', err.message);
  }
}

export default autoMigrateIfEmpty;
