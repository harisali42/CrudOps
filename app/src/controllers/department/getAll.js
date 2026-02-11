const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { getAllDepartments: getAllDepartmentsService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object().keys({
  page: Joi.number().integer().min(0).default(0),
  size: Joi.number().integer().min(1).default(10),
});

module.exports = async function getAllDepartments(req, res, next) {
  try {
    const validated = await schema.validateAsync(req.query, { abortEarly: false });
    const result = await getAllDepartmentsService(validated.page, validated.size);
    if (!result.success) {
      return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, 'Departments fetched successfully', { departments: result.data });
  } catch (error) {
    next(error);
  }
};
