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
// Department controllers
const createDepartment = require('./department/create');
const getAllDepartments = require('./department/getAll');
const getDepartmentById = require('./department/getById');
const updateDepartment = require('./department/update');
const deleteDepartment = require('./department/delete');
const assignStudentToDepartment = require('./department/assignStudent');
const assignTeacherToDepartment = require('./department/assignTeacher');

// Class controllers
const createClass = require('./class/create');
const getAllClasses = require('./class/getAll');
const getClassById = require('./class/getById');
const updateClass = require('./class/update');
const deleteClass = require('./class/delete');
const assignStudentToClass = require('./class/assignStudent');
const assignTeacherToClass = require('./class/assignTeacher');

// Course controllers
const createCourse = require('./course/create');
const getAllCourses = require('./course/getAll');
const getCourseById = require('./course/getById');
const updateCourse = require('./course/update');
const deleteCourse = require('./course/delete');
const enrollStudent = require('./course/enrollStudent');
const assignTeacherToCourse = require('./course/assignTeacher');

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
  // Department
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  assignStudentToDepartment,
  assignTeacherToDepartment,
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
  // Class
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignStudentToClass,
  assignTeacherToClass,
  // Course
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollStudent,
  assignTeacherToCourse,
};
