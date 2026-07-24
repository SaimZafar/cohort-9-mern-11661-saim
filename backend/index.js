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

const app = express();

app.disable('x-powered-by');
app.use(cors({
origin: process.env.CORS_ORIGIN || '*',
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
); // logs every incoming request/response, with sensitive headers redacted
app.get('/', (req, res) => {
  res.send('Notes App backend is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Catch requests to routes that don't exist
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler must be the last middleware registered
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;