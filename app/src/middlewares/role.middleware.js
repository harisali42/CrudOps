const { ROLE } = require('../constants/enums');
const { sendResponse } = require('../utils/response');

exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {

    // Support both .Roles (belongsToMany) and .UserRoles (hasMany)
    let userRoles = [];
    if (Array.isArray(req.user.Roles)) {
      userRoles = req.user.Roles.map(role => role.name);
    } else if (Array.isArray(req.user.UserRoles)) {
      userRoles = req.user.UserRoles.map(ur => ur.Role && ur.Role.name).filter(Boolean);
    }

    const hasAccess = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (!hasAccess) {
      return sendResponse(res, 403, false, 'Forbidden: insufficient role');
    }

    next();
  };
};
