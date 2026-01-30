const { User, Role } = require('../../models');

module.exports = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Role, through: { attributes: [] } }],
  });
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  // Map roles to a simple array of role names
  const userJson = user.toJSON();
  userJson.roles = userJson.Roles ? userJson.Roles.map(r => r.name) : [];
  delete userJson.Roles;
  return { success: true, data: userJson };
};
