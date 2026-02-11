const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { assignTeacherToClass: assignTeacherToClassService } = require('../../services/class.service');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object({
  teacherId: Joi.number().required(),
  classId: Joi.number().required(),
});

module.exports = async function assignTeacher(req, res, next) {
  try {
    const { classId } = req.params;
    const { teacherId } = req.body;
    
    const result = await assignTeacherToClassService(teacherId, classId);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message);
  } catch (error) {
    next(error);
  }
};
