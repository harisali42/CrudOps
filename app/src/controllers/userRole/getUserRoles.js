
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { getUserRoles: getUserRolesService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const paramsSchema = Joi.object().keys({
  userId: Joi.string().required(),
});

module.exports = async function getUserRoles(req, res, next) {
  try {
    const { userId } = await paramsSchema.validateAsync(req.params, { abortEarly: false });
    const result = await getUserRolesService(userId);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { roles: result.data });
  } catch (error) {
    next(error);
  }
};
