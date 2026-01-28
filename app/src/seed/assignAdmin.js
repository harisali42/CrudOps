require('dotenv').config();

const { User, Role, UserRole } = require('../models');
const { ROLE } = require('../constants/enums');
const logger = require('../config/logger');

(async () => {
  try {
    const user = await User.findOne({ where: { email: 'your-email@example.com' } }); // Change this email
    const role = await Role.findOne({ where: { name: ROLE.ADMIN } });

    if (!user) throw new Error('Admin user not found');
    if (!role) throw new Error('ADMIN role not found');

    await UserRole.findOrCreate({
      where: {
        userId: user.id,
        roleId: role.id,
      },
    });

    logger.info('✅ ADMIN role assigned successfully');
    process.exit(0);
  } catch (err) {
    logger.error('❌', err.message);
    process.exit(1);
  }
})();
