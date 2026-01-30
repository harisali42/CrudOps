const express = require('express');
const router = express.Router();
const { createRole, getAllRoles, getRoleById, updateRole, deleteRole } = require('../controllers');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');


router.post('/', authenticate, authorize('ADMIN'), createRole);
router.get('/', authenticate, authorize('ADMIN'), getAllRoles);
router.get('/:id', authenticate, authorize('ADMIN'), getRoleById);
router.put('/:id', authenticate, authorize('ADMIN'), updateRole);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteRole);

module.exports = router;
