
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { authService } = require('../../services');

const schema = Joi.object().keys({
  authorization: Joi.string().pattern(/^Bearer\s.+/).required(),
});

module.exports = async function logout(req, res, next) {
  try {
    const validated = await schema.validateAsync(req.headers, { abortEarly: false });
    const token = validated.authorization.split(' ')[1];
    const data = await authService.logout(token);
    return res.status(StatusCodes.OK).json({
      message: 'Logout successful',
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
