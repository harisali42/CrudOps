

const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { loginUser } = require('../../services');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = async function login(req, res, next) {
  try {
    const validated = await schema.validateAsync(req.body, { abortEarly: false });
    const result = await loginUser(validated.email, validated.password);
    if (!result.success) {
      return sendResponse(res, StatusCodes.UNAUTHORIZED, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { user: result.data });
  } catch (error) {
    next(error);
  }
};
