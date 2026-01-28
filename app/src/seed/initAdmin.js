require('dotenv').config();
const bcrypt = require('bcrypt');
const { User, Role, UserRole } = require('../models');

/**
 * Initialize first admin user
 * Run this once to bootstrap your application
 */
(async () => {
  try {
    console.log('🚀 Starting admin initialization...');

    // Step 1: Create ADMIN role if not exists
    const [adminRole] = await Role.findOrCreate({
      where: { name: 'ADMIN' },
      defaults: { 
        name: 'ADMIN', 
        description: 'System Administrator' 
      },
    });
    console.log('ADMIN role created/found');

    // Step 2: Create USER role if not exists (optional)
    const [userRole] = await Role.findOrCreate({
      where: { name: 'USER' },
      defaults: { 
        name: 'USER', 
        description: 'Regular User' 
      },
    });
    console.log('✅ USER role created/found');

    // Step 2b: Create MANAGER role if not exists
    const [managerRole] = await Role.findOrCreate({
      where: { name: ROLE.MANAGER },
      defaults: { 
        name: ROLE.MANAGER, 
        description: 'Team Manager' 
      },
    });
    logger.info('✅ MANAGER role created/found');

    // Step 3: Create first admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    let adminUser = await User.findOne({ where: { email: adminEmail } });
    
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      adminUser = await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        isActive: true,
      });
      logger.info(`✅ Admin user created: ${adminEmail}`);
    } else {
      logger.info(`ℹ️  Admin user already exists: ${adminEmail}`);
    }

    // Step 4: Assign ADMIN role to user
    const [assignment, created] = await UserRole.findOrCreate({
      where: {
        userId: adminUser.id,
        roleId: adminRole.id,
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
