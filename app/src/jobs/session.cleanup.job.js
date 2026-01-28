const cron = require('node-cron');
const { Session } = require('../models');

/**
 * Clean up invalid sessions
 * Runs every day at 2:00 AM
 */
cron.schedule('0 2 * * *', async () => {
  try {
    console.log('[Cron Job] Starting session cleanup...');
    
    // Delete invalid sessions
    const invalidSessions = await Session.destroy({
      where: { isValid: false },
    });

    // Delete sessions older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const oldSessions = await Session.destroy({
      where: {
        createdAt: {
          [require('sequelize').Op.lt]: sevenDaysAgo,
        },
      },
    });

    console.log(`[Cron Job] Cleaned up ${invalidSessions} invalid sessions and ${oldSessions} old sessions`);
  } catch (error) {
    console.error('[Cron Job] Session cleanup failed:', error.message);
  }
});

console.log('[Cron Job] Session cleanup job scheduled (daily at 2:00 AM)');
