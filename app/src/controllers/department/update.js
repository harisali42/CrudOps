const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { updateDepartment: updateDepartmentService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const paramsSchema = Joi.object().keys({
  id: Joi.string().required(),
});

const bodySchema = Joi.object().keys({
  name: Joi.string(),
  code: Joi.string(),
  description: Joi.string().allow('', null),
});

module.exports = async function updateDepartment(req, res, next) {
  try {
    const { id } = await paramsSchema.validateAsync(req.params, { abortEarly: false });
    const validatedBody = await bodySchema.validateAsync(req.body, { abortEarly: false });
    
    const result = await updateDepartmentService(id, validatedBody);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { department: result.data });
  } catch (error) {
    next(error);
  }
};
