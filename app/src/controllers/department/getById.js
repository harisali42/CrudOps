const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { getDepartmentById: getDepartmentByIdService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object().keys({
  id: Joi.string().required(),
});

module.exports = async function getDepartmentById(req, res, next) {
  try {
    const { id } = await schema.validateAsync(req.params, { abortEarly: false });
    const result = await getDepartmentByIdService(id);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, 'Department fetched successfully', { department: result.data });
  } catch (error) {
    next(error);
  }
};
