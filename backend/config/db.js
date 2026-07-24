const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then((conn) => {
    logger.info('MySQL connected successfully');
    conn.release();
  })
  .catch((err) => {
    logger.error({ err }, 'Failed to connect to MySQL');
  });

module.exports = pool;