const logger = require('./logger');
const sequelize = require('./database');

const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected successfully');

    await sequelize.sync({ alter: false });
    logger.info('Models synced');

    const tables = await sequelize.getQueryInterface().showAllTables();
    logger.info(`Tables: ${tables.join(', ')}`);
  } catch (err) {
    logger.error('Database connection failed:', err);
    process.exit(1);
  }
};

module.exports = initDatabase;
