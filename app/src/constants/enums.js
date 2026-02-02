/**
 * Application Enums
 * Centralized enum definitions to avoid typos and duplication
 */

// Environment types
exports.NODE_ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};

// Database dialects
exports.DB_DIALECT = {
  MYSQL: 'mysql',
  POSTGRES: 'postgres',
  SQLITE: 'sqlite',
  MSSQL: 'mssql',
};

// Log levels
exports.LOG_LEVEL = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

// User roles
exports.ROLE = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER',
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
};

// User Types
exports.USER_TYPE = {
  GENERAL: 'General',
  SCIENCE: 'Science',
  ARTS: 'Arts',
  PRE_ENGINEERING: 'Pre-Engineering',
  PRE_MEDICAL: 'Pre-Medical',
  ICS: 'ICS',
  COMMERCE: 'Commerce',
};

// Get all valid values from enum
exports.getEnumValues = (enumObj) => Object.values(enumObj);
