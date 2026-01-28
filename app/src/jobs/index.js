/**
 * Initialize all cron jobs
 */

// Only run cron jobs in development or production, not in test
if (process.env.NODE_ENV !== 'test') {
  require('./session.cleanup.job');
  require('./user.cleanup.job');
  
  console.log('[Cron Jobs] All scheduled jobs initialized');
}

module.exports = {};
