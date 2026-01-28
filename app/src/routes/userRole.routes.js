const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRole.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Only admins can assign/remove roles
router.post('/:userId/roles', authenticate, authorize('ADMIN'), userRoleController.assignRole);
router.delete('/:userId/roles', authenticate, authorize('ADMIN'), userRoleController.removeRole);
router.get('/:userId/roles', userRoleController.getUserRoles);

module.exports = router;
