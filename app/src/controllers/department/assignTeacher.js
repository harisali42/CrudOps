const { StatusCodes } = require('http-status-codes');

const Joi = require('joi');
const { assignTeacherToDepartment: assignTeacherService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const paramsSchema = Joi.object().keys({
  departmentId: Joi.string().required(),
});

const bodySchema = Joi.object().keys({
  teacherId: Joi.number().required(),
});

module.exports = async function assignTeacherToDepartment(req, res, next) {
  try {
    const { departmentId } = await paramsSchema.validateAsync(req.params, { abortEarly: false });
    const { teacherId } = await bodySchema.validateAsync(req.body, { abortEarly: false });
    
    const result = await assignTeacherService(departmentId, teacherId);
    if (!result.success) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, result.data);
  } catch (error) {
    next(error);
  }
};
