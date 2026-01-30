const { User, Role, UserRole } = require('../../models');
const { getEnumValues } = require('../../constants/enums');

module.exports = async (userId, roleName) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Validate role name exists in ROLE enum
    const validRoles = getEnumValues(require('../../constants/enums').ROLE);
    if (!validRoles.includes(roleName)) {
      return { success: false, message: `Invalid role. Allowed roles: ${validRoles.join(', ')}` };
    }

    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      return { success: false, message: 'Role not found' };
    }

    // Check if already assigned
    const existingAssignment = await UserRole.findOne({ where: { userId: user.id, roleId: role.id } });
    if (existingAssignment) {
      return { success: false, message: 'Role already assigned to user' };
    }

    const userRole = await UserRole.create({ userId: user.id, roleId: role.id });
    return { success: true, message: 'Role assigned successfully', data: { user, role, userRole } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
