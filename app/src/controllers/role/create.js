

const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { createRole: createRoleService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

module.exports = async function createRole(req, res, next) {
  try {
    const validate = await schema.validateAsync(req.body, { abortEarly: false });
    const result = await createRoleService({ ...validate, created_by: req.user?.id });
    if (!result.success) {
      return sendResponse(res, StatusCodes.CONFLICT, false, result.message);
    }
    return sendResponse(res, StatusCodes.CREATED, true, result.message, { role: result.data });
  } catch (error) {
    next(error);
  }
};
