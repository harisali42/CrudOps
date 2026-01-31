// Centralized controller exports

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

// Teacher controllers
const createTeacher = require('./teacher/create');
const getAllTeachers = require('./teacher/getAll');
const getTeacherById = require('./teacher/getById');
const updateTeacher = require('./teacher/update');
const deleteTeacher = require('./teacher/delete');

// Student controllers
const createStudent = require('./student/create');
const getAllStudents = require('./student/getAll');
const getStudentById = require('./student/getById');
const updateStudent = require('./student/update');
const deleteStudent = require('./student/delete');

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
  // Teacher
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  // Student  
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
