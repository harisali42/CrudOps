const express = require('express');
const router = express.Router();
const { getUserById, updateUser, deleteUser, assignRole, removeRole, getUserRoles, createUser, getAllUsers } = require('../controllers');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');


// Get all users
router.get('/', authenticate, getAllUsers);
// Create user
router.post('/', createUser);
// Get, Update, Delete user by ID
router.get('/:id', authenticate, authorize('ADMIN'), getUserById);
router.put('/:id', authenticate, authorize('ADMIN'), updateUser);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteUser);
// User-Role join endpoints
router.post('/:userId/roles', assignRole); // Assign role to user
router.delete('/:userId/roles', authenticate, authorize('ADMIN'), removeRole); // Remove role from user
router.get('/:userId/roles', authenticate, authorize('ADMIN'), getUserRoles); // Get all roles for user

module.exports = router;
