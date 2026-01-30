const express = require('express');
const router = express.Router();
const { loginUser, logoutUser } = require('../../controllers');
const { validateSchema } = require('../../middlewares/validate.schema.middleware');
const { loginSchema } = require('../../validations/auth.validation');


router.post('/login', validateSchema(loginSchema), loginUser);
router.post('/logout', logoutUser);

module.exports = router;
