const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { updateCourse: updateCourseService } = require('../../services/course.service');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().optional(),
  code: Joi.string().optional(),
  description: Joi.string().optional(),
  credits: Joi.number().optional(),
});

module.exports = async function updateCourse(req, res, next) {
  try {
    const { id, ...data } = await schema.validateAsync({ id: req.params.id, ...req.body }, { abortEarly: false });
    const result = await updateCourseService(id, data);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { course: result.data });
  } catch (error) {
    next(error);
  }
};
