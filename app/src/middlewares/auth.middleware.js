const { verifyToken } = require('../config/jwt');
const { User, Session, Role } = require('../models');

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    const token = parts[1];

    // Verify JWT
    const decoded = verifyToken(token);

    if (!decoded.userId || !decoded.sessionId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Check active session using sessionId
    const session = await Session.findOne({
      where: {
        id: decoded.sessionId,
        userId: decoded.userId,
        isValid: true,
      },
    });

    if (!session) {
      return res.status(401).json({ message: 'Session expired or logged out' });
    }


    // Load user with roles via UserRole
    const user = await User.findByPk(decoded.userId, {
      include: [
        {
          model: require('../models').UserRole,
          include: [
            {
              model: Role,
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'Invalid or inactive user' });
    }

    // Attach data to request
    req.user = user;
    req.sessionId = decoded.sessionId;

    next();
  } catch (error) {
    console.error('AUTH ERROR:', error);
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};
