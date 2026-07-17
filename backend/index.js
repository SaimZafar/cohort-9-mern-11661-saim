const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
require('dotenv').config();

const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger })); // logs every incoming request/response

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