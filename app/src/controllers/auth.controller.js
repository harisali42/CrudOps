const bcrypt = require('bcrypt');
const { User, Session } = require('../models');
const { generateToken } = require('../config/jwt');
const { sendResponse } = require('../utils/response');
const { loginSchema } = require('../validations/auth.validation');

/**
 * LOGIN
 */
exports.loginUser = async (req, res) => {

  const { error } = loginSchema.validate(req.body);
  if (error) {
    return sendResponse(res, 400, false, error.details[0].message);
  }
  try {
    const { email, password } = req.body;

    // if (!email || !password) {
    //   return sendResponse(res, 400, false, 'Email and password are required');
    // }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    if (!user.isActive) {
      return sendResponse(res, 403, false, 'User is inactive');
    }

    const token = generateToken({ userId: user.id });

    await Session.create({
      userId: user.id,
      token,
    });

    return sendResponse(res, 200, true, 'Login successful', {
      token,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * LOGOUT
 */
exports.logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return sendResponse(res, 401, false, 'Token missing');
    }

    const session = await Session.findOne({ where: { token } });
    if (!session) {
      return sendResponse(res, 400, false, 'Invalid session');
    }

    session.isValid = false;
    await session.save();

    return sendResponse(res, 200, true, 'Logout successful');
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
