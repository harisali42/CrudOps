const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers');

// Create a new student
router.post('/', authenticate, authorize('ADMIN'), createStudent);

// Get all students with pagination
router.get('/', authenticate, authorize('ADMIN', 'TEACHER'), getAllStudents);

// Get student by ID
router.get('/:id', authenticate, authorize('ADMIN', 'TEACHER'), getStudentById);

// Update student by ID
router.put('/:id', authenticate, authorize('ADMIN'), updateStudent);

// Delete student by ID
router.delete('/:id', authenticate, authorize('ADMIN'), deleteStudent);

module.exports = router;
