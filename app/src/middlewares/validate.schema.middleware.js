const { sendResponse } = require('../utils/response');

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} source - 'body' | 'params' | 'query' (default: 'body')
 * @returns {Function} Express middleware
 */
exports.validateSchema = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return sendResponse(res, 400, false, 'Validation failed', { errors: messages });
    }

    // Attach validated data back to request
    req[source] = value;
    next();
  };
};
