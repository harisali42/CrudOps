require('dotenv').config();
require('./config/env'); // Validate environment variables

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const logger = require('./config/logger');
const initDatabase = require('./config/database.init');
const { limiter, authLimiter } = require('./config/rateLimiting');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

// Routes
const routes = require('./routes');

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
}));

// Health check endpoint
routes.healthRoutes(app);

// API routes
app.use('/api/v1/users', routes.userRoutes);
app.use('/api/v1/roles', routes.roleRoutes);
app.use('/api/v1/auth', routes.authRoutes);
app.use('/api/v1/students', routes.studentRoutes);
app.use('/api/v1/teachers', routes.teacherRoutes);
app.use('/api/v1/classes', routes.classRoutes);
app.use('/api/v1/courses', routes.courseRoutes);


// 404 handler & Global error handler (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database
initDatabase();

module.exports = app;
