exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.Roles.map(role => role.name);

    const hasAccess = allowedRoles.some(role =>
      userRoles.includes(role)
    );

    if (!hasAccess) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    next();
  };
};
