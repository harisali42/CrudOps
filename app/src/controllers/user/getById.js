

const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { getUserById: getUserByIdService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object().keys({
  id: Joi.string().required(),
});

module.exports = async function getUserById(req, res, next) {
  try {
    const validated = await schema.validateAsync(req.params, { abortEarly: false });
    const result = await getUserByIdService(validated.id);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { user: result.data });
  } catch (error) {
    next(error);
  }
};
