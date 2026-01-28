const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRole.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLE } = require('../constants/enums');

/**
 * @swagger
 * /api/v1/user-roles/{userId}/roles:
 *   post:
 *     summary: Assign role to user
 *     description: Assign a role to a user (admin only)
 *     tags:
 *       - User Roles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['roleName']
 *             properties:
 *               roleName:
 *                 type: string
 *                 enum: [ADMIN, MANAGER, USER]
 *                 example: MANAGER
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized or not admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:userId/roles', authenticate, authorize(ROLE.ADMIN), userRoleController.assignRole);

/**
 * @swagger
 * /api/v1/user-roles/{userId}/roles:
 *   delete:
 *     summary: Remove role from user
 *     description: Remove a role from a user (admin only)
 *     tags:
 *       - User Roles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['roleName']
 *             properties:
 *               roleName:
 *                 type: string
 *                 enum: [ADMIN, MANAGER, USER]
 *                 example: MANAGER
 *     responses:
 *       200:
 *         description: Role removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized or not admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:userId/roles', authenticate, authorize(ROLE.ADMIN), userRoleController.removeRole);

/**
 * @swagger
 * /api/v1/user-roles/{userId}/roles:
 *   get:
 *     summary: Get user roles
 *     description: Retrieve roles assigned to a user
 *     tags:
 *       - User Roles
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Role'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:userId/roles', userRoleController.getUserRoles);

module.exports = router;
