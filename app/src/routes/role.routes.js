const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validateSchema } = require('../middlewares/validate.schema.middleware');
const { createRoleSchema, updateRoleSchema } = require('../validations/role.validation');
const { roleIdParamSchema } = require('../validations/role.param.validation');

router.post('/', validateSchema(createRoleSchema), roleController.createRole);
router.get('/', roleController.getAllRoles);
router.get('/:id', validateSchema(roleIdParamSchema, 'params'), roleController.getRoleById);
router.put('/:id', validateSchema(roleIdParamSchema, 'params'), validateSchema(updateRoleSchema), roleController.updateRole);
router.delete('/:id', validateSchema(roleIdParamSchema, 'params'), roleController.deleteRole);

module.exports = router;
