// Centralized controller exports for user, role, auth, and userRole

// User controllers
const createUser = require('./user/create');
const getAllUsers = require('./user/getAll');
const getUserById = require('./user/getById');
const updateUser = require('./user/update');
const deleteUser = require('./user/delete');

// Role controllers
const createRole = require('./role/create');
const getAllRoles = require('./role/getAll');
const getRoleById = require('./role/getById');
const updateRole = require('./role/update');
const deleteRole = require('./role/delete');

// Auth controllers
const loginUser = require('./auth/login');
const logoutUser = require('./auth/logout');

// UserRole controllers
const assignRole = require('./userRole/assignRole');
const removeRole = require('./userRole/removeRole');
const getUserRoles = require('./userRole/getUserRoles');

module.exports = {
  // User
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  // Role
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  // Auth
  loginUser,
  logoutUser,
  // UserRole
  assignRole,
  removeRole,
  getUserRoles,
};
