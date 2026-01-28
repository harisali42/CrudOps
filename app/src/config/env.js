const Joi = require('joi');
const logger = require('./logger');
const { NODE_ENV, DB_DIALECT, LOG_LEVEL, getEnumValues } = require('../constants/enums');

// Define required environment variables
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid(...getEnumValues(NODE_ENV)).default(NODE_ENV.DEVELOPMENT),
  PORT: Joi.number().default(3000),
  
  // Database
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_DIALECT: Joi.string().valid(...getEnumValues(DB_DIALECT)).default(DB_DIALECT.MYSQL),
  
  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  
  // Admin
  ADMIN_EMAIL: Joi.string().email().required(),
  ADMIN_PASSWORD: Joi.string().min(6).required(),
  ADMIN_NAME: Joi.string().required(),
  
  // Logging
  LOG_LEVEL: Joi.string().valid(...getEnumValues(LOG_LEVEL)).default(LOG_LEVEL.INFO),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  logger.error(`Config validation error: ${error.message}`);
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = envVars;
