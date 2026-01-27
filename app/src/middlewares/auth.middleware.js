const { verifyToken } = require('../config/jwt');
const { User, Session, Role } = require('../models');

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const decoded = verifyToken(token);

    const session = await Session.findOne({
      where: { token, isValid: true },
    });
    if (!session) {
      return res.status(401).json({ message: 'Session expired or logged out' });
    }

    const user = await User.findByPk(decoded.userId, {
      include: Role,
    });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
