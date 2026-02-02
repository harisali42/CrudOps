const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const { updateClass: updateClassService } = require('../../services/class.service');
const { sendResponse } = require('../../utils/response');

const schema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().optional(),
  roomNumber: Joi.string().optional(),
  capacity: Joi.number().optional(),
});

module.exports = async function updateClass(req, res, next) {
  try {
    const { id, ...data } = await schema.validateAsync({ id: req.params.id, ...req.body }, { abortEarly: false });
    const result = await updateClassService(id, data);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { class: result.data });
  } catch (error) {
    next(error);
  }
};
