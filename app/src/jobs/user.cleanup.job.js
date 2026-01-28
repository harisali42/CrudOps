const cron = require('node-cron');
const { User } = require('../models');
const { Op } = require('sequelize');

/**
 * Permanently delete soft-deleted users after 30 days
 * Runs every day at 3:00 AM
 */
cron.schedule('0 3 * * *', async () => {
  try {
    console.log('[Cron Job] Starting user cleanup...');
    
    // Get date 30 days ago
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Find soft-deleted users older than 30 days
    const deletedUsers = await User.findAll({
      where: {
        deletedAt: {
          [Op.lt]: thirtyDaysAgo,
        },
      },
      paranoid: false, // Include soft-deleted records
    });

    // Permanently delete them
    const count = deletedUsers.length;
    for (const user of deletedUsers) {
      await user.destroy({ force: true });
    }

    console.log(`[Cron Job] Permanently deleted ${count} users (soft-deleted >30 days ago)`);
  } catch (error) {
    console.error('[Cron Job] User cleanup failed:', error.message);
  }
});

console.log('[Cron Job] User cleanup job scheduled (daily at 3:00 AM)');
