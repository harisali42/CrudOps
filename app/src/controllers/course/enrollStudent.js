const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { enrollStudent: enrollStudentService } = require('../../services/course.service');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object({
  studentId: Joi.number().required(),
  courseId: Joi.number().required(),
});

module.exports = async function enrollStudent(req, res, next) {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;
    
    const result = await enrollStudentService(studentId, courseId);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message);
  } catch (error) {
    next(error);
  }
};
