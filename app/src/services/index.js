// Centralized service exports for user, role, and auth

// User services
const { createUser, getAllUsers, getUserById, updateUser, deleteUser, assignRole, removeRole, getUserRoles } = require('./user.service');

// Role services
const { createRole, getAllRoles, getRoleById, updateRole, deleteRole } = require('./role.service');

// Student services
const { createStudent,getAllStudents, getStudentById, updateStudent, deleteStudent } = require('./student.service');

// Teacher services
const { createTeacher,getAllTeachers, getTeacherById, updateTeacher, deleteTeacher } = require('./teacher.service');

// Auth services
const { loginUser, logoutUser } = require('./auth.service');

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
  // Student
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  getAllStudents,
  // Teacher
  createTeacher,
  getTeacherById,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
};