const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollStudent,
  assignTeacherToCourse,
} = require('../controllers');

// Create a new course
router.post('/', authenticate, authorize('ADMIN'), createCourse);

// Get all courses
router.get('/', authenticate, getAllCourses);

// Get course by ID
router.get('/:id', authenticate, getCourseById);

// Update course by ID
router.put('/:id', authenticate, authorize('ADMIN'), updateCourse);

// Delete course by ID
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCourse);

// Enroll student in course
router.post('/:courseId/students', authenticate, authorize('ADMIN'), enrollStudent);

// Assign teacher to course
router.post('/:courseId/teachers', authenticate, authorize('ADMIN'), assignTeacherToCourse);

module.exports = router;
