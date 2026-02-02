const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { createCourse: createCourseService } = require('../../services/course.service');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().optional(),
  credits: Joi.number().optional(),
});

module.exports = async function createCourse(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const result = await createCourseService(validate);
    if (!result.success) {
      return sendResponse(res, StatusCodes.CONFLICT, false, result.message);
    }
    return sendResponse(res, StatusCodes.CREATED, true, result.message, { course: result.data });
  } catch (error) {
    next(error);
  }
};
