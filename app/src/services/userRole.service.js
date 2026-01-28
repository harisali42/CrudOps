const { User, Role, UserRole } = require('../models');
const { getEnumValues } = require('../constants/enums');

/**
 * ASSIGN ROLE TO USER
 */
exports.assignRoleToUser = async (userId, roleName) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Validate role name exists in ROLE enum
  const validRoles = getEnumValues(require('../constants/enums').ROLE);
  if (!validRoles.includes(roleName)) {
    throw new Error(`Invalid role. Allowed roles: ${validRoles.join(', ')}`);
  }

  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) {
    throw new Error('Role not found');
  }

  // Check if already assigned
  const existingAssignment = await UserRole.findOne({
    where: { userId: user.id, roleId: role.id },
  });

  if (existingAssignment) {
    throw new Error('Role already assigned to user');
  }

  // Assign role
  await UserRole.create({
    userId: user.id,
    roleId: role.id,
  });

  return { user, role };
};

/**
 * REMOVE ROLE FROM USER
 */
exports.removeRoleFromUser = async (userId, roleName) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Validate role name exists in ROLE enum
  const validRoles = getEnumValues(require('../constants/enums').ROLE);
  if (!validRoles.includes(roleName)) {
    throw new Error(`Invalid role. Allowed roles: ${validRoles.join(', ')}`);
  }

  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) {
    throw new Error('Role not found');
  }

  const deleted = await UserRole.destroy({
    where: { userId: user.id, roleId: role.id },
  });

  if (!deleted) {
    throw new Error('Role assignment not found');
  }

  return { user, role };
};

/**
 * GET USER ROLES
 */
exports.getUserRoles = async (userId) => {
  const user = await User.findByPk(userId, {
    include: Role,
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user.Roles;
};
