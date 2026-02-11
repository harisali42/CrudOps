const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { createClass: createClassService } = require('../../services/class.service');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object({
  name: Joi.string().required(),
  roomNumber: Joi.string().optional(),
  capacity: Joi.number().optional(),
});

module.exports = async function createClass(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const result = await createClassService(validate);
    if (!result.success) {
      return sendResponse(res, StatusCodes.CONFLICT, false, result.message);
    }
    return sendResponse(res, StatusCodes.CREATED, true, result.message, { class: result.data });
  } catch (error) {
    next(error);
  }
};
