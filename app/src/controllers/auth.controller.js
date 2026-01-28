const { sendResponse } = require('../utils/response');
const authService = require('../services/auth.service');

/**
 * LOGIN
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return sendResponse(res, 200, true, 'Login successful', result);
  } catch (error) {
    const statusCode = error.message.includes('Invalid') ? 401 : 403;
    return sendResponse(res, statusCode, false, error.message);
  }
};

/**
 * LOGOUT
 */
exports.logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    await authService.logoutUser(token);
    return sendResponse(res, 200, true, 'Logout successful');
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};
