const express = require('express');
const router = express.Router();
const { createRole, getAllRoles, getRoleById, updateRole, deleteRole } = require('../../controllers');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');
const { validateSchema } = require('../../middlewares/validate.schema.middleware');
const { createRoleSchema, updateRoleSchema, roleIdParamSchema } = require('../../validations/role.validation');


router.post('/', validateSchema(createRoleSchema), createRole);
router.get('/', getAllRoles);
router.get('/:id', validateSchema(roleIdParamSchema, 'params'), getRoleById);
router.put('/:id', validateSchema(roleIdParamSchema, 'params'), validateSchema(updateRoleSchema), updateRole);
router.delete('/:id', validateSchema(roleIdParamSchema, 'params'), deleteRole);

module.exports = router;
