const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { assignTeacher: assignTeacherService } = require('../../services/course.service');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object({
  teacherId: Joi.number().required(),
  courseId: Joi.number().required(),
});

module.exports = async function assignTeacher(req, res, next) {
  try {
    const { courseId } = req.params;
    const { teacherId } = req.body;
    
    const result = await assignTeacherService(teacherId, courseId);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message);
  } catch (error) {
    next(error);
  }
};
