const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { validateSchema } = require('../middlewares/validate.schema.middleware');
const { createUserSchema, updateUserSchema, userIdParamSchema } = require('../validations/user.validation');

router.post('/', validateSchema(createUserSchema), userController.createUser);

router.get('/', userController.getAllUsers);
router.get('/:id', validateSchema(userIdParamSchema, 'params'), userController.getUserById);
router.put('/:id', validateSchema(userIdParamSchema, 'params'), validateSchema(updateUserSchema), userController.updateUser);
router.delete('/:id', validateSchema(userIdParamSchema, 'params'), userController.deleteUser);

module.exports = router;
