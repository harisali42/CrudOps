const Joi = require('joi');


exports.createUserSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

exports.updateUserSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  status: Joi.string().valid('active', 'non-active').optional(),
});

exports.userIdParamSchema = Joi.object({
  id: Joi.number().required().messages({
    'number.base': 'User ID must be a number',
    'any.required': 'User ID is required',
  }),
});
