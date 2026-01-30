

const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { assignRole: assignRoleService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const paramsSchema = Joi.object().keys({
  userId: Joi.string().required(),
});

const bodySchema = Joi.object().keys({
  roleName: Joi.string().required(),
});

module.exports = async function assignRole(req, res, next) {
  try {
    const { userId } = await paramsSchema.validateAsync(req.params, { abortEarly: false });
    const { roleName } = await bodySchema.validateAsync(req.body, { abortEarly: false });
    const result = await assignRoleService(userId, roleName);
    if (!result.success) {
      return sendResponse(res, StatusCodes.CONFLICT, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { userRole: result.data });
  } catch (error) {
    next(error);
  }
};
