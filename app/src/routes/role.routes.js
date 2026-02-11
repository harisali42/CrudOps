const express = require('express');
const router = express.Router();
const { createRole, getAllRoles, getRoleById, updateRole, deleteRole } = require('../controllers');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');


// Create a new role
router.post('/', authenticate, authorize('ADMIN'), createRole);

// Get all roles
router.get('/', authenticate, authorize('ADMIN'), getAllRoles);

// Get role by ID
router.get('/:id', authenticate, authorize('ADMIN'), getRoleById);

// Update role by ID
router.put('/:id', authenticate, authorize('ADMIN'), updateRole);

// Delete role by ID
router.delete('/:id', authenticate, authorize('ADMIN'), deleteRole);

module.exports = router;
