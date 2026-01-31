const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require('../controllers');

// Create a new student
router.post('/', authenticate, createStudent);

// Get all students with pagination
router.get('/', authenticate, getAllStudents);

// Get student by ID
router.get('/:id', authenticate, getStudentById);

// Update student by ID
router.put('/:id', authenticate, updateStudent);

// Delete student by ID
router.delete('/:id', authenticate, deleteStudent);

module.exports = router;
