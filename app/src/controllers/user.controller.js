const { sendResponse } = require('../utils/response');
const userService = require('../services/user.service');

/**
 * CREATE USER
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.createUser(name, email, password);
    return sendResponse(res, 201, true, 'User created successfully', user);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

/**
 * GET ALL USERS
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 0, size = 10 } = req.query;
    const users = await userService.getAllUsers(page, size);
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
    const user = await userService.getUserById(id);
    return sendResponse(res, 200, true, 'User fetched', user);
  } catch (error) {
    return sendResponse(res, 404, false, error.message);
  }
};

/**
 * UPDATE USER
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;
    const user = await userService.updateUser(id, name, isActive);
    return sendResponse(res, 200, true, 'User updated', user);
  } catch (error) {
    return sendResponse(res, 404, false, error.message);
  }
};

/**
 * DELETE USER
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    return sendResponse(res, 200, true, 'User deleted');
  } catch (error) {
    return sendResponse(res, 404, false, error.message);
  }
};
