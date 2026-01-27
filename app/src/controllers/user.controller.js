const bcrypt = require('bcrypt');
const { User } = require('../models');
const { sendResponse } = require('../utils/response');

/**
 * CREATE USER
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendResponse(res, 400, false, 'All fields are required');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendResponse(res, 409, false, 'Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return sendResponse(res, 201, true, 'User created successfully', user);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * GET ALL USERS
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });

    return sendResponse(res, 200, true, 'Users fetched', users);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * GET USER BY ID
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    return sendResponse(res, 200, true, 'User fetched', user);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * UPDATE USER
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    await user.update({ name, isActive });

    return sendResponse(res, 200, true, 'User updated', user);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * DELETE USER
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    await user.destroy();

    return sendResponse(res, 200, true, 'User deleted');
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
