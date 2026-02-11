const logger = require('./logger');
const sequelize = require('./database');

const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');

    // Use force: false to avoid altering existing tables and creating duplicate indexes
    // Only use alter: true in development when needed, or use migrations
    await sequelize.sync({ force: false });
    logger.info('Models synced');

    const tables = await sequelize.getQueryInterface().showAllTables();
    logger.info(`Tables: ${tables.join(', ')}`);
  } catch (err) {
    logger.error('Database connection failed:', err);
    process.exit(1);
  }
};

module.exports = initDatabase;
