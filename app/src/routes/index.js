
const express = require('express');
const userRoutes = require('./user.routes');
const roleRoutes = require('./role.routes');
const authRoutes = require('./auth.routes');
const healthRoutes = require('./health.routes');
const studentRoutes = require('./student.routes');
const teacherRoutes = require('./teacher.routes');
const classRoutes = require('./class.routes');
const courseRoutes = require('./course.routes');
const departmentRoutes = require('./department.routes');

const router = express.Router();

// Health check endpoint
healthRoutes(router);

router.use('/v1/users', userRoutes);
router.use('/v1/roles', roleRoutes);
router.use('/v1/auth', authRoutes);
router.use('/v1/students', studentRoutes);
router.use('/v1/teachers', teacherRoutes);
router.use('/v1/classes', classRoutes);
router.use('/v1/courses', courseRoutes);
router.use('/v1/departments', departmentRoutes);

module.exports = router;
