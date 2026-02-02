const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require('../controllers');

// Create a new teacher
router.post('/', authenticate, authorize('ADMIN'), createTeacher);

// Get all teachers with pagination
router.get('/', authenticate, getAllTeachers);

// Get teacher by ID
router.get('/:id', authenticate, getTeacherById);

// Update teacher by ID
router.put('/:id', authenticate, authorize('ADMIN'), updateTeacher);

// Delete teacher by ID
router.delete('/:id', authenticate, authorize('ADMIN'), deleteTeacher);

module.exports = router;
