const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { assignStudentToClass: assignStudentToClassService } = require('../../services/class.service');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object({
  studentId: Joi.number().required(),
  classId: Joi.number().required(),
});

module.exports = async function assignStudent(req, res, next) {
  try {
    const { classId } = req.params;
    const { studentId } = req.body;
    
    const result = await assignStudentToClassService(studentId, classId);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message);
  } catch (error) {
    next(error);
  }
};
