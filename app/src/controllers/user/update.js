

const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { updateUser: updateUserService } = require('../../services');
const { sendResponse } = require('../../utils/response');
const { USER_TYPE, getEnumValues } = require('../../constants/enums');

const paramsSchema = Joi.object().keys({
  id: Joi.number().required(),
});

const bodySchema = Joi.object().keys({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  status: Joi.string().optional(),
  userType: Joi.string().valid(...getEnumValues(USER_TYPE)).optional(),
});

module.exports = async function updateUser(req, res, next) {
  try {
    const { id } = await paramsSchema.validateAsync(req.params, { abortEarly: false });
    const validatedBody = await bodySchema.validateAsync(req.body, { abortEarly: false });
    const result = await updateUserService({ id, ...validatedBody, updated_by: req.user?.id });
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { user: result.data });
  } catch (error) {
    next(error);
  }
};
