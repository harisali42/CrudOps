const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { markClassAttendance: markClassAttendanceService } = require('../../services/attendance.service');
const { sendResponse } = require('../../utils/response');
const { ATTENDANCE_STATUS } = require('../../constants/enums');

const schema = Joi.object({
  classId: Joi.number().integer().required(),
  date: Joi.date().iso().optional(),
  records: Joi.array().items(
    Joi.object({
      studentId: Joi.number().integer().required(),
      status: Joi.string().valid(...Object.values(ATTENDANCE_STATUS)).required(),
    })
  ).min(1).required(),
});

module.exports = async function markClassAttendance(req, res, next) {
  try {
    const validated = await schema.validateAsync({
      classId: req.params.classId,
      date: req.body.date,
      records: req.body.records,
    }, { abortEarly: false });

    const result = await markClassAttendanceService({
      teacherUserId: req.user.id,
      classId: validated.classId,
      attendanceDate: validated.date,
      records: validated.records,
    });

    if (!result.success) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, false, result.message);
    }

    return sendResponse(res, StatusCodes.OK, true, result.message, result.data);
  } catch (error) {
    next(error);
  }
};
