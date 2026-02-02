const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { updateStudent: updateStudentService } = require('../../services/student.service');
const { sendResponse } = require('../../utils/response');

// Validation schema
const schema = Joi.object().keys({
  id: Joi.number().integer().required(),
  rollNo: Joi.string().optional(),
  admissionDate: Joi.date().optional(),
  classId: Joi.number().integer().optional(),
});

module.exports = async function updateStudent(req, res, next) {
  try {
    // Only allow id, rollNo, admissionDate, and classId in the update body
    const { id, rollNo, admissionDate, classId } = req.body;
    const validatedData = await schema.validateAsync({ id, rollNo, admissionDate, classId }, { abortEarly: false });

    const result = await updateStudentService(validatedData);

    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }

    return sendResponse(res, StatusCodes.OK, true, 'Student updated successfully', result.data);
  } catch (error) {
    next(error);
  }
};
