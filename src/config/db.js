const { Pool } = require('pg');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// SSL configuration for Supabase / Cloud Platforms (Render, etc.)
const sslConfig = {
  rejectUnauthorized: false,
};

// 1. pg (node-postgres) Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: sslConfig,
});

// Test connection and log success
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to database');
    client.release();
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1); // Exit if connection fails in production
  }
};

testConnection();

// 2. Sequelize Instance (Backward compatibility for models)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: sslConfig,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = {
  pool,
  sequelize,
  query: (text, params) => pool.query(text, params),
};

