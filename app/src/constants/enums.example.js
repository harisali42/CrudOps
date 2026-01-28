/**
 * Example: Using Enums in Your Code
 */

const { NODE_ENV, DB_DIALECT, LOG_LEVEL, ROLE } = require('../constants/enums');

// ✅ Good: Use enum constants (no typos!)
if (process.env.NODE_ENV === NODE_ENV.PRODUCTION) {
  // Hide errors in production
}

// ❌ Bad: String literals (easy to typo)
if (process.env.NODE_ENV === 'prodution') {  // Typo! Won't match
  // This branch never executes
}

// ✅ Using role enums
const adminRole = ROLE.ADMIN;
const userRole = ROLE.USER;
const managerRole = ROLE.MANAGER;

// ✅ Using database enum
const dbType = DB_DIALECT.MYSQL;

// ✅ Using log level enum
const logLevel = LOG_LEVEL.DEBUG;
