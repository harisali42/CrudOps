const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { getStudentAttendance: getStudentAttendanceService } = require('../../services/attendance.service');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object({
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional(),
});

module.exports = async function getMyAttendance(req, res, next) {
  try {
    const validated = await schema.validateAsync({
      from: req.query.from,
      to: req.query.to,
    }, { abortEarly: false });

    if (validated.from && validated.to) {
      const from = new Date(validated.from);
      const to = new Date(validated.to);
      if (from > to) {
        return sendResponse(res, StatusCodes.BAD_REQUEST, false, 'From date must be before to date');
      }
    }

    const result = await getStudentAttendanceService({
      studentUserId: req.user.id,
      fromDate: validated.from,
      toDate: validated.to,
    });

    if (!result.success) {
      const status = result.message && result.message.includes('not found')
        ? StatusCodes.NOT_FOUND
        : StatusCodes.BAD_REQUEST;
      return sendResponse(res, status, false, result.message);
    }

    return sendResponse(res, StatusCodes.OK, true, 'Attendance fetched successfully', result.data);
  } catch (error) {
    next(error);
  }
};
