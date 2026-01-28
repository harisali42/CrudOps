const { sendResponse } = require('../utils/response');
const userRoleService = require('../services/userRole.service');

/**
 * ASSIGN ROLE TO USER
 */
exports.assignRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleName } = req.body;

    const result = await userRoleService.assignRoleToUser(userId, roleName);
    
    return sendResponse(res, 200, true, 'Role assigned successfully', result);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

/**
 * REMOVE ROLE FROM USER
 */
exports.removeRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleName } = req.body;

    const result = await userRoleService.removeRoleFromUser(userId, roleName);
    
    return sendResponse(res, 200, true, 'Role removed successfully', result);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

/**
 * GET USER ROLES
 */
exports.getUserRoles = async (req, res) => {
  try {
    const { userId } = req.params;

    const roles = await userRoleService.getUserRoles(userId);
    
    return sendResponse(res, 200, true, 'Roles fetched', roles);
  } catch (error) {
    return sendResponse(res, 404, false, error.message);
  }
};
