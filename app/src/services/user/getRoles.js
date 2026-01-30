const { User, Role } = require('../../models');

module.exports = async (userId) => {
  const user = await User.findByPk(userId, { include: Role });
  if (!user) return { success: false, message: 'User not found' };
  return { success: true, message: 'Roles fetched', data: user.Roles };
};
