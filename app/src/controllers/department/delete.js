const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { deleteDepartment: deleteDepartmentService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object().keys({
  id: Joi.string().required(),
});

module.exports = async function deleteDepartment(req, res, next) {
  try {
    const { id } = await schema.validateAsync(req.params, { abortEarly: false });
    const result = await deleteDepartmentService(id);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { department: result.data });
  } catch (error) {
    next(error);
  }
};
