const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { updateTeacher: updateTeacherService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object({
  id: Joi.number().integer().required(),
  employeeId: Joi.string().optional(),
  department: Joi.string().optional(),
});

module.exports = async function updateTeacher(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const result = await updateTeacherService(validate);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { teacher: result.data });
  } catch (error) {
    next(error);
  }
};
