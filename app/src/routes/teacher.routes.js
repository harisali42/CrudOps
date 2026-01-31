const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require('../controllers');

// Create a new teacher
router.post('/', authenticate, createTeacher);

// Get all teachers with pagination
router.get('/', authenticate, getAllTeachers);

// Get teacher by ID
router.get('/:id', authenticate, getTeacherById);

// Update teacher by ID
router.put('/:id', authenticate, updateTeacher);

// Delete teacher by ID
router.delete('/:id', authenticate, deleteTeacher);

module.exports = router;
