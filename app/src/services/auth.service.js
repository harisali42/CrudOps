const bcrypt = require('bcrypt');
const { User, Session } = require('../models');
const { generateToken } = require('../config/jwt');

/**
 * LOGIN USER
 */
exports.loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('User is inactive');
  }

  const token = generateToken({ userId: user.id });

  await Session.create({
    userId: user.id,
    token,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

/**
 * LOGOUT USER
 */
exports.logoutUser = async (token) => {
  if (!token) {
    throw new Error('Token missing');
  }

  const session = await Session.findOne({ where: { token } });
  if (!session) {
    throw new Error('Invalid session');
  }

  session.isValid = false;
  await session.save();

  return session;
};
