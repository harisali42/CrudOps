const createDepartment = require('./create');
const getAllDepartments = require('./getAll');
const getDepartmentById = require('./getById');
const updateDepartment = require('./update');
const deleteDepartment = require('./delete');
const assignStudentToDepartment = require('./assignStudent');
const assignTeacherToDepartment = require('./assignTeacher');

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  assignStudentToDepartment,
  assignTeacherToDepartment,
};
