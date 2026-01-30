const bcrypt = require('bcrypt');
const { User, Session } = require('../../models');
const { generateToken } = require('../../config/jwt');

module.exports = async (email, password) => {
  if (!email || !password) {
    return { success: false, message: 'Email and password are required' };
  }

  const user = await User.findOne({ where: { email } });
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

  // Create session first
  const session = await Session.create({
    userId: user.id,
  });

  // Generate token with userId + sessionId
  const token = generateToken({
    userId: user.id,
    sessionId: session.id,
  });

  return {
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        status: user.status,
      },
    },
  };
};
