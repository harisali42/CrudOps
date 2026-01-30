const { User } = require('../../models');

module.exports = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  return { success: true, data: user };
};
