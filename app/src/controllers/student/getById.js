const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { getStudentById: getStudentByIdService } = require('../../services/student.service');
const { sendResponse } = require('../../utils/response');

// Validation schema
const schema = Joi.object().keys({
  id: Joi.number().integer().required(),
});

module.exports = async function getStudentById(req, res, next) {
  try {
    const { id } = await schema.validateAsync(req.params, { abortEarly: false });

    const result = await getStudentByIdService(id);

    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }

    return sendResponse(res, StatusCodes.OK, true, 'Student fetched successfully', result.data);
  } catch (error) {
    next(error);
  }
};
