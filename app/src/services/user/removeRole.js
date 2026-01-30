const { User, Role, UserRole } = require('../../models');
const { getEnumValues } = require('../../constants/enums');

module.exports = async (userId, roleName) => {
  const user = await User.findByPk(userId);
  if (!user) return { success: false, message: 'User not found' };

  // Validate role name exists in ROLE enum
  const validRoles = getEnumValues(require('../../constants/enums').ROLE);
  if (!validRoles.includes(roleName)) {
    return { success: false, message: `Invalid role. Allowed roles: ${validRoles.join(', ')}` };
  }

  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) return { success: false, message: 'Role not found' };

  const deleted = await UserRole.destroy({ where: { userId: user.id, roleId: role.id } });
  if (!deleted) return { success: false, message: 'Role assignment not found' };

  return { success: true, data: { user, role } };
};
