const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { createTeacher: createTeacherService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object({
  userId: Joi.number().integer().required(),
  employeeId: Joi.string().required(),
  department: Joi.string().optional(),
});

module.exports = async function createTeacher(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const result = await createTeacherService({ ...validate, created_by: req.user?.id });
    if (!result.success) {
      return sendResponse(res, StatusCodes.CONFLICT, false, result.message);
    }
    return sendResponse(res, StatusCodes.CREATED, true, result.message, { teacher: result.data });
  } catch (error) {
    next(error);
  }
};
