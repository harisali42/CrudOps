const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  assignStudentToDepartment,
  assignTeacherToDepartment,
} = require('../controllers');

// Create a new department
router.post('/', authenticate, authorize('ADMIN'), createDepartment);

// Get all departments
router.get('/', authenticate, getAllDepartments);

// Get department by ID
router.get('/:id', authenticate, getDepartmentById);

// Update department by ID
router.put('/:id', authenticate, authorize('ADMIN'), updateDepartment);

// Delete department by ID
router.delete('/:id', authenticate, authorize('ADMIN'), deleteDepartment);

// Assign student to department
router.post('/:departmentId/students', authenticate, authorize('ADMIN'), assignStudentToDepartment);

// Assign teacher to department
router.post('/:departmentId/teachers', authenticate, authorize('ADMIN'), assignTeacherToDepartment);

module.exports = router;
