const bcrypt = require('bcrypt');
const { User } = require('../models');

/**
 * CREATE USER
 */
exports.createUser = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return User.create({
    name,
    email,
    password: hashedPassword,
  });
};

/**
 * GET ALL USERS
 */
exports.getAllUsers = async () => {
  return User.findAll({
    attributes: { exclude: ['password'] },
  });
};

/**
 * GET USER BY ID
 */
exports.getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * UPDATE USER
 */
exports.updateUser = async (id, name, isActive) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }

  await user.update({ name, isActive });
  return user;
};

/**
 * DELETE USER
 */
exports.deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }

  await user.destroy();
  return user;
};
