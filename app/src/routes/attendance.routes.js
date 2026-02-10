const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { markClassAttendance, getMyAttendance } = require('../controllers');

// Teacher marks attendance for a class on a date
router.post('/classes/:classId/mark', authenticate, authorize('TEACHER'), markClassAttendance);

// Student views own attendance
router.get('/me', authenticate, authorize('STUDENT'), getMyAttendance);

module.exports = router;
