const express = require('express');
const router = express.Router();
const { loginUser, logoutUser } = require('../controllers');


router.post('/login', loginUser);
router.post('/logout', require('../middlewares/auth.middleware').authenticate, logoutUser);

module.exports = router;
