// Centralized service exports for user, role, and auth

// User services
const createUser = require('./user/create');
const getAllUsers = require('./user/getAll');
const getUserById = require('./user/getById');
const updateUser = require('./user/update');
const deleteUser = require('./user/delete');
const assignRole = require('./user/assignRole');
const removeRole = require('./user/removeRole');
const getUserRoles = require('./user/getRoles');

// Role services
const createRole = require('./role/create');
const getAllRoles = require('./role/getAll');
const getRoleById = require('./role/getById');
const updateRole = require('./role/update');
const deleteRole = require('./role/delete');

// Auth services
const loginUser = require('./auth/login');
const logoutUser = require('./auth/logout');

module.exports = {
  // User
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignRole,
  removeRole,
  getUserRoles,
  // Role
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  // Auth
  loginUser,
  logoutUser,
};
