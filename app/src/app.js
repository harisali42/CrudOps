require('dotenv').config();
require('./config/env'); // Validate environment variables

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const logger = require('./config/logger');
const initDatabase = require('./config/database.init');
const { limiter, authLimiter } = require('./config/rateLimiting');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

// Routes
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const authRoutes = require('./routes/auth.routes');
const userRoleRoutes = require('./routes/userRole.routes');
const healthRoutes = require('./routes/health.routes');

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

// Health check endpoint
healthRoutes(app);

// API routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user-roles', userRoleRoutes);

// 404 handler & Global error handler (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database
initDatabase();

module.exports = app;
