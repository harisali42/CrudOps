const { Role } = require('../models');

/**
 * CREATE ROLE
 */
exports.createRole = async (name, description) => {
  if (!name) {
    throw new Error('Role name is required');
  }

  const existingRole = await Role.findOne({ where: { name } });
  if (existingRole) {
    throw new Error('Role already exists');
  }

  return Role.create({ name, description });
};

/**
 * GET ALL ROLES
 */
exports.getAllRoles = async () => {
  return Role.findAll();
};

/**
 * GET ROLE BY ID
 */
exports.getRoleById = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) {
    throw new Error('Role not found');
  }

  return role;
};

/**
 * UPDATE ROLE
 */
exports.updateRole = async (id, name, description) => {
  const role = await Role.findByPk(id);
  if (!role) {
    throw new Error('Role not found');
  }

  await role.update({ name, description });
  return role;
};

/**
 * DELETE ROLE
 */
exports.deleteRole = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) {
    throw new Error('Role not found');
  }

  await role.destroy();
  return role;
};
