
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { authService } = require('../../services');

module.exports = async function logout(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !/^Bearer\s.+/.test(authHeader)) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing or invalid authorization header' });
    }
    const token = authHeader.split(' ')[1];
    const data = await require('../../services').logoutUser(req.sessionId);
    return res.status(StatusCodes.OK).json({
      message: 'Logout successful',
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
