const { Role } = require('../models');

//const models = require('../models');

// Create role
async function createRole({ name, description }) {
  if (!name) {
    return { success: false, message: 'Role name is required' };
  }
  const existingRole = await Role.findOne({ where: { name } });
  if (existingRole) {
    return { success: false, message: 'Role already exists' };
  }
  const newRole = await Role.create({ name, description });
  return { success: true, data: newRole };
}

// Get all roles
async function getAllRoles() {
  const roles = await Role.findAll();
  return { success: true, message: 'Roles fetched', data: roles };
}

// Get role by ID
async function getRoleById(id) {
  const role = await Role.findByPk(id);
  if (!role) {
    return { success: false, message: 'Role not found' };
  }
  return { success: true, data: role };
}

// Update role
async function updateRole(data) {
  const { id, name, description } = data;
  const role = await Role.findByPk(id);
  if (!role) {
    return {
      success: false,
      message: 'Role not found',
      data: null
    };
  }
  await role.update({ name, description });
  return {
    success: true,
    data: role
  };
}

// Delete role
async function deleteRole(id) {
  const role = await Role.findByPk(id);
  if (!role) {
    return { success: false, message: 'Role not found' };
  }
  await role.destroy();
  return { success: true, message: 'Role deleted', data: role };
}

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
