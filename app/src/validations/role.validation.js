const Joi = require('joi');

exports.createRoleSchema = Joi.object({
  name: Joi.string().uppercase().required().messages({
    'string.uppercase': 'Role name must be uppercase',
    'any.required': 'Role name is required',
  }),
  description: Joi.string().optional(),
});

exports.updateRoleSchema = Joi.object({
  name: Joi.string().uppercase().optional().messages({
    'string.uppercase': 'Role name must be uppercase',
  }),
  description: Joi.string().optional(),
});

