const { User } = require('../../models');

module.exports = async (data) => {
  const { id, firstName, lastName, status } = data;
  const user = await User.findByPk(id);
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  await user.update({ firstName, lastName, status });
  return { success: true, message: 'User updated', data: user };
};
