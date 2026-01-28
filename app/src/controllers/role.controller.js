const { sendResponse } = require('../utils/response');
const roleService = require('../services/role.service');

/**
 * CREATE ROLE
 */
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await roleService.createRole(name, description);
    return sendResponse(res, 201, true, 'Role created successfully', role);
  } catch (error) {
    return sendResponse(res, 409, false, error.message);
  }
};

/**
 * GET ALL ROLES
 */
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    return sendResponse(res, 200, true, 'Roles fetched', roles);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * GET ROLE BY ID
 */
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await roleService.getRoleById(id);
    return sendResponse(res, 200, true, 'Role fetched', role);
  } catch (error) {
    return sendResponse(res, 404, false, error.message);
  }
};

/**
 * UPDATE ROLE
 */
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const role = await roleService.updateRole(id, name, description);
    return sendResponse(res, 200, true, 'Role updated', role);
  } catch (error) {
    return sendResponse(res, 404, false, error.message);
  }
};

/**
 * DELETE ROLE
 */
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    await roleService.deleteRole(id);
    return sendResponse(res, 200, true, 'Role deleted');
  } catch (error) {
    return sendResponse(res, 404, false, error.message);
  }
};
