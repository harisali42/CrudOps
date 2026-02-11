const bcrypt = require('bcrypt');
const { User, Session, UserRole, Role } = require('../models');
const { generateToken } = require('../config/jwt');

// Login user
async function loginUser(email, password) {
  if (!email || !password) {
    return { success: false, message: 'Email and password are required' };
  }
  const user = await User.findOne({ 
    where: { email },
    include: [
      {
        model: UserRole,
        include: [{ model: Role, attributes: ['name'] }]
      }
    ]
  });
  if (!user) {
    return { success: false, message: 'Invalid credentials' };
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { success: false, message: 'Invalid credentials' };
  }
  if (user.status !== 'active') {
    return { success: false, message: 'User is inactive' };
  }
  
  // Extract roles
  const roles = user.UserRoles 
    ? user.UserRoles.map(ur => ur.Role && ur.Role.name).filter(Boolean)
    : [];

  // Create session first
  const session = await Session.create({ userId: user.id });
  // Generate token with userId + sessionId + roles
  const token = generateToken({ userId: user.id, sessionId: session.id, roles });


  return {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        roles, // Return roles to frontend
      },
      sessionId: session.id,
    },
  };
}

// Logout user
async function logoutUser(sessionId) {
  if (!sessionId) {
    return { success: false, message: 'Session ID missing' };
  }
  const session = await Session.findOne({
    where: {
      id: sessionId,
      isValid: true,
    },
  });
  if (!session) {
    return { success: false, message: 'Session already logged out or invalid' };
  }
  session.isValid = false;
  await session.save();
  return { success: true, data: session };
}

module.exports = {
  loginUser,
  logoutUser,
};
