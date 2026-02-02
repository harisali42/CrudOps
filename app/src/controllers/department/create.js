const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { createDepartment: createDepartmentService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object().keys({
  name: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().allow('', null),
});

module.exports = async function createDepartment(req, res, next) {
  try {
    const validated = await schema.validateAsync(req.body, { abortEarly: false });
    const result = await createDepartmentService(validated);
    if (!result.success) {
      return sendResponse(res, StatusCodes.CONFLICT, false, result.message);
    }
    return sendResponse(res, StatusCodes.CREATED, true, result.message, { department: result.data });
  } catch (error) {
    next(error);
  }
};
