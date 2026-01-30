const { User } = require('../../models');

module.exports = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  await user.destroy();
  return { success: true, data: user };
};
