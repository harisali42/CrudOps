const express = require('express');
const router = express.Router();
const { getUserById, updateUser, deleteUser, assignRole, removeRole, getUserRoles, createUser, getAllUsers } = require('../../controllers');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');
const { validateSchema } = require('../../middlewares/validate.schema.middleware');
const { createUserSchema, updateUserSchema, userIdParamSchema } = require('../../validations/user.validation');



// Get all users
router.get('/', getAllUsers);

// Create user
router.post('/', createUser);

// Get, Update, Delete user by ID
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// User-Role join endpoints
router.post('/:userId/roles', assignRole); // Assign role to user
router.delete('/:userId/roles', removeRole); // Remove role from user
router.get('/:userId/roles', getUserRoles); // Get all roles for user

module.exports = router;
