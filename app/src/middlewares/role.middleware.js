const { ROLE } = require('../constants/enums');
const { sendResponse } = require('../utils/response');

exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.Roles.map(role => role.name);

    const hasAccess = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (!hasAccess) {
      return sendResponse(res, 403, false, 'Forbidden: insufficient role');
    }

    next();
  };
};
