const express = require('express');
const router = express.Router();
const { loginUser, logoutUser } = require('../controllers');


// Login user and get token
router.post('/login', loginUser);

// Logout user (invalidate token if applicable, usually client-side)
router.post('/logout', require('../middlewares/auth.middleware').authenticate, logoutUser);

module.exports = router;
