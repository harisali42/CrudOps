const Joi = require('joi');

exports.roleIdParamSchema = Joi.object({
  id: Joi.number().required().messages({
    'number.base': 'Role ID must be a number',
    'any.required': 'Role ID is required',
  }),
});


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

