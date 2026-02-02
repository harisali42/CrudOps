const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { createStudent: createStudentService } = require('../../services/student.service');
const { sendResponse } = require('../../utils/response');

// Validation schema
const schema = Joi.object().keys({
  userId: Joi.number().integer().required(), // linking student to existing user
  rollNo: Joi.string().required(),
  admissionDate: Joi.date().required(),
  classId: Joi.number().integer().optional(),
  leaveDate: Joi.date().optional(),
});

module.exports = async function createStudent(req, res, next) {
  try {
    // Validate request body
    const validatedData = await schema.validateAsync(req.body, { abortEarly: false });

    // Call the service layer
    const result = await createStudentService({ ...validatedData, created_by: req.user?.id });

    if (!result.success) {
      return sendResponse(res, StatusCodes.CONFLICT, false, result.message);
    }

    return sendResponse(res, StatusCodes.CREATED, true, result.message, { student: result.data });
  } catch (error) {
    next(error);
  }
};
