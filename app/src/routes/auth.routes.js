const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateSchema } = require('../middlewares/validate.schema.middleware');
const { loginSchema } = require('../validations/auth.validation');

router.post('/login', validateSchema(loginSchema), authController.loginUser);
router.post('/logout', authController.logoutUser);

module.exports = router;
