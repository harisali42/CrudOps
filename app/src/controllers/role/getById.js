

const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { getRoleById: getRoleByIdService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object().keys({
  id: Joi.number().required(),
});

module.exports = async function getRoleById(req, res, next) {
  try {
    const validated = await schema.validateAsync(req.params, { abortEarly: false });
    const result = await getRoleByIdService(validated.id);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { role: result.data });
  } catch (error) {
    next(error);
  }
};
