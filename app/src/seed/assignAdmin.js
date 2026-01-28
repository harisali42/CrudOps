require('dotenv').config();

const { User, Role, UserRole } = require('../models');

(async () => {
  try {
    const user = await User.findOne({ where: { email: 'your-email@example.com' } }); // Change this email
    const role = await Role.findOne({ where: { name: 'ADMIN' } });

    if (!user) throw new Error('Admin user not found');
    if (!role) throw new Error('ADMIN role not found');

    await UserRole.findOrCreate({
      where: {
        userId: user.id,
        roleId: role.id,
      },
    });

    console.log('✅ ADMIN role assigned successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌', err.message);
    process.exit(1);
  }
})();
