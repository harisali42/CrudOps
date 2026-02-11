

const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { updateRole: updateRoleService } = require('../../services');
const { sendResponse } = require('../../utils/response');

const paramsSchema = Joi.object().keys({
  id: Joi.number().required(),
});

const bodySchema = Joi.object().keys({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
});

module.exports = async function updateRole(req, res, next) {
  try {
    const { id } = await paramsSchema.validateAsync(req.params, { abortEarly: false });
    const validatedBody = await bodySchema.validateAsync(req.body, { abortEarly: false });
    const result = await updateRoleService({ id, ...validatedBody, updated_by: req.user?.id });
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { role: result.data });
  } catch (error) {
    next(error);
  }
};
