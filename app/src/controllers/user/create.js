

const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { createUser: createUserService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = async function createUser(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const result = await createUserService({ ...validate, created_by: req.user?.id });
    if (!result.success) {
      return sendResponse(res, StatusCodes.CONFLICT, false, result.message);
    }
    return sendResponse(res, StatusCodes.CREATED, true, result.message, { user: result.data });
  } catch (error) {
    next(error);
  }
};
