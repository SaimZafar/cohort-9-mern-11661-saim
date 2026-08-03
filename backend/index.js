const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
require('dotenv').config();
const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
if (!process.env.JWT_SECRET) {
  throw new Error('Missing required environment variable: JWT_SECRET');
}
/** @type {import('express').Express} */
const app = express();
app.disable('x-powered-by');
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction && !process.env.CORS_ORIGIN) {
  throw new Error('Missing required environment variable: CORS_ORIGIN (required in production)');
}
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());
app.use(
  pinoHttp({
    logger,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',
      ],
      censor: '[Redacted]',
    },
  })
);
app.get('/', (req, res) => {
  res.send('Notes App backend is running');
});
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
/**
 * Catch requests to routes that don't exist.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const pool = require('./config/db');
async function startServer() {
  try {
    const conn = await pool.getConnection();
    conn.release();
    logger.info('MySQL connected successfully');
    const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  logger.error({ err }, `Failed to start server on port ${PORT}`);
  process.exit(1);
});
  } catch (err) {
    logger.error({ err }, 'Failed to connect to MySQL — server will not start');
    process.exit(1);
  }
}
if (require.main === module) {
  startServer();
}
module.exports = app;