const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { assignStudentToDepartment: assignStudentService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const paramsSchema = Joi.object().keys({
  departmentId: Joi.number().required(),
});

const bodySchema = Joi.object().keys({
  studentId: Joi.number().required(),
});

module.exports = async function assignStudentToDepartment(req, res, next) {
  try {
    const { departmentId } = await paramsSchema.validateAsync(req.params, { abortEarly: false });
    const { studentId } = await bodySchema.validateAsync(req.body, { abortEarly: false });
    
    const result = await assignStudentService(departmentId, studentId);
    if (!result.success) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, result.data);
  } catch (error) {
    next(error);
  }
};
