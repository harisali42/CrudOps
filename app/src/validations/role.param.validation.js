const Joi = require('joi');

exports.roleIdParamSchema = Joi.object({
  id: Joi.number().required().messages({
    'number.base': 'Role ID must be a number',
    'any.required': 'Role ID is required',
  }),
});
