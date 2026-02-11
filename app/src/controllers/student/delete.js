const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { deleteStudent: deleteStudentService } = require('../../services/student.service');
const { sendResponse } = require('../../utils/response');

// Validation schema
const schema = Joi.object().keys({
  id: Joi.number().integer().required(),
});

module.exports = async function deleteStudent(req, res, next) {
  try {
    const { id } = await schema.validateAsync(req.params, { abortEarly: false });

    const result = await deleteStudentService(id);

    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }

    return sendResponse(res, StatusCodes.OK, true, 'Student deleted successfully', result.data);
  } catch (error) {
    next(error);
  }
};
