/**
 * CRM Lead Management System - Database Setup Script
 *
 * This script:
 *  1. Creates the database and tables (runs schema.sql)
 *  2. Creates the test user with a hashed password
 *  3. Inserts sample lead & note data (runs seed.sql)
 *
 * Usage (run from the project root):
 *   cd backend && node ../database/seed.js
 */

const path = require('path');
// Load .env from backend/ folder regardless of where the script is called from
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const mysql  = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs     = require('fs');

async function setup() {
  // Connect without selecting a database yet
  const connection = await mysql.createConnection({
    host             : process.env.DB_HOST     || 'localhost',
    user             : process.env.DB_USER     || 'root',
    password         : process.env.DB_PASSWORD || '',
    multipleStatements: true,   // Required to execute the full schema in one call
  });

  console.log('Connected to MySQL...\n');

  // ── 1. Run schema.sql (CREATE DATABASE + CREATE TABLEs) ──────────────────
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await connection.query(schemaSql);
  console.log('Schema applied (database + tables created if not existing).');

  // ── 2. Create test user ──────────────────────────────────────────────────
  await connection.query('USE crm_db');

  const [existing] = await connection.query(
    'SELECT id FROM users WHERE email = ?',
    ['admin@example.com']
  );

  if (existing.length === 0) {
    const hashed = await bcrypt.hash('password123', 10);
    await connection.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      ['Admin User', 'admin@example.com', hashed]
    );
    console.log('Test user created  →  admin@example.com  /  password123');
  } else {
    console.log('Test user already exists, skipping.');
  }

  // ── 3. Run seed.sql (sample leads & notes) ───────────────────────────────
  const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
  await connection.query(seedSql);
  console.log('Sample data inserted (leads + notes).');

  await connection.end();
  console.log('\nDatabase setup complete!');
  console.log('Next: cd backend && npm run dev');
}

setup().catch(err => {
  console.error('\nSetup failed:', err.message);
  process.exit(1);
});
