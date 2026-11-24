const fs = require('fs');
const path = require('path');
const { PGlite } = require('@electric-sql/pglite');
const { Pool } = require('pg');
require('dotenv').config();

let dbInstance = null;
let isPool = false;

async function getDb() {
  if (dbInstance) return dbInstance;

  // If explicit DATABASE_URL is provided, try pg Pool
  if (process.env.DATABASE_URL) {
    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
      });
      await pool.query('SELECT 1');
      console.log('✅ Connected to external PostgreSQL via Pool');
      dbInstance = pool;
      isPool = true;
      return dbInstance;
    } catch (err) {
      console.warn('⚠️ External PostgreSQL connection failed. Falling back to persistent PGlite engine:', err.message);
    }
  }

  // Use persistent PGlite PostgreSQL engine
  const dataDir = path.join(__dirname, '../../data/pgdata');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const pglite = new PGlite(dataDir);
  await pglite.waitReady;
  console.log('✅ PostgreSQL (PGlite) engine ready at:', dataDir);

  dbInstance = {
    async query(text, params = []) {
      // PGlite returns { rows, fields, affectedRows }
      const res = await pglite.query(text, params);
      return {
        rows: res.rows || [],
        rowCount: res.affectedRows !== undefined ? res.affectedRows : (res.rows ? res.rows.length : 0),
        fields: res.fields || []
      };
    },
    async close() {
      await pglite.close();
    }
  };

  return dbInstance;
}

async function query(text, params = []) {
  const db = await getDb();
  return db.query(text, params);
}

async function initDb() {
  const db = await getDb();
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Split and execute statements
  const statements = schemaSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    try {
      await db.query(statement);
    } catch (err) {
      console.error('Schema exec error on statement:', statement.slice(0, 50), err.message);
    }
  }

  console.log('✅ Database schema initialized successfully');
}

module.exports = {
  getDb,
  query,
  initDb
};

