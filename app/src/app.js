require('dotenv').config();
require('./config/env'); // Validate environment variables

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const initDatabase = require('./config/database.init');
const { limiter, authLimiter } = require('./config/rateLimiting');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

// Routes
const router = require('./routes');

require('./models');
require('./jobs'); // Initialize cron jobs

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Rate limiting middleware
app.use('/api/v1/auth', authLimiter);
app.use(limiter);

// Body parsing & compression
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CrudOps API Documentation',
  swaggerOptions: {
    docExpansion: 'none', // Collapse all dropdowns by default
    defaultModelsExpandDepth: -1, // Hide schemas section at the bottom
  },
}));



// Register all routes under /api
app.use('/api', router);

// Chat status endpoint (for monitoring)
app.get('/api/v1/chat/status', (req, res) => {
  const { getSystemStatus } = require('./chat/socketSetup');
  try {
    const status = getSystemStatus();
    return res.json({ success: true, data: status });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 404 handler & Global error handler (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database
initDatabase();

module.exports = app;
