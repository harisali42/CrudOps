const Joi = require('joi');

exports.createUserSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
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
  name: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

exports.userIdParamSchema = Joi.object({
  id: Joi.number().required().messages({
    'number.base': 'User ID must be a number',
    'any.required': 'User ID is required',
  }),
});
