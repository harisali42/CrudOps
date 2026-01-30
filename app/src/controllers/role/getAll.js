

const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { getAllRoles: getAllRolesService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object().keys({
  page: Joi.number().integer().min(0).default(0),
  size: Joi.number().integer().min(1).default(10),
});

module.exports = async function getAllRoles(req, res, next) {
  try {
    const validated = await schema.validateAsync(req.query, { abortEarly: false });
    const result = await getAllRolesService(validated.page, validated.size);
    if (!result.success) {
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { roles: result.data });
  } catch (error) {
    next(error);
  }
};
