require('dotenv').config();
const bcrypt = require('bcrypt');
const { User, Role, UserRole } = require('../models');
const logger = require('../config/logger');
const { ROLE } = require('../constants/enums');

/**
 * Initialize first admin user
 * Run this once to bootstrap your application
 */
(async () => {
  try {
    console.log('🚀 Starting admin initialization...');


    // Step 1: Create ADMIN role if not exists
    let adminRole = await Role.findOne({ where: { name: 'ADMIN' } });
    if (!adminRole) {
      adminRole = await Role.create({ name: 'ADMIN', description: 'System Administrator' });
      console.log('ADMIN role created');
    } else {
      logger.info('ADMIN role already exists');
    }

    // Step 2: Create USER role if not exists (optional)
    let userRole = await Role.findOne({ where: { name: 'USER' } });
    if (!userRole) {
      userRole = await Role.create({ name: 'USER', description: 'Regular User' });
      console.log('✅ USER role created');
    } else {
      logger.info('USER role already exists');
    }

    // Step 2b: Create MANAGER role if not exists
    let managerRole = await Role.findOne({ where: { name: ROLE.MANAGER } });
    if (!managerRole) {
      managerRole = await Role.create({ name: ROLE.MANAGER, description: 'Team Manager' });
      logger.info('✅ MANAGER role created');
    } else {
      logger.info('MANAGER role already exists');
    }


    // Step 3: Create first admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin';


    let adminUser = await User.findOne({ where: { email: adminEmail } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      adminUser = await User.create({
        firstName: adminName,
        lastName: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        status: 'active',
      });
      logger.info(`✅ Admin user created: ${adminEmail} (password: ${adminPassword})`);
    } else {
      logger.info(`ℹ️  Admin user already exists: ${adminEmail}`);
    }

    // Step 4: Assign ADMIN role to user
    const adminRoleId = adminRole.id;
    const [assignment, created] = await UserRole.findOrCreate({
      where: {
        userId: adminUser.id,
        roleId: adminRoleId,
      },
    });

    if (created) {
      logger.info('✅ ADMIN role assigned to user');
    } else {
      logger.info('ℹ️  User already has ADMIN role');
    }

    logger.info('\n🎉 Admin initialization complete!');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.info('📧 Email:', adminEmail);
    logger.info('🔑 Password:', adminPassword);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    logger.info('⚠️  IMPORTANT: Change the password after first login!\n');

    process.exit(0);
  } catch (err) {
    logger.error('Error:', err.message);
    logger.error(err);
    process.exit(1);
  }
})();
