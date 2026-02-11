const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignStudentToClass,
  assignTeacherToClass,
} = require('../controllers');

// Create a new class
router.post('/', authenticate, authorize('ADMIN'), createClass);

// Get all classes
router.get('/', authenticate, getAllClasses);

// Get class by ID
router.get('/:id', authenticate, getClassById);

// Update class by ID
router.put('/:id', authenticate, authorize('ADMIN'), updateClass);

// Delete class by ID
router.delete('/:id', authenticate, authorize('ADMIN'), deleteClass);

// Assign student to class
router.post('/:classId/students', authenticate, authorize('ADMIN'), assignStudentToClass);

// Assign teacher to class
router.post('/:classId/teachers', authenticate, authorize('ADMIN'), assignTeacherToClass);

module.exports = router;
