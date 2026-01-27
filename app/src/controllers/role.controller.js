const { Role } = require('../models');
const { sendResponse } = require('../utils/response');

/**
 * CREATE ROLE
 */
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return sendResponse(res, 400, false, 'Role name is required');
    }

    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return sendResponse(res, 409, false, 'Role already exists');
    }

    const role = await Role.create({ name, description });

    return sendResponse(res, 201, true, 'Role created successfully', role);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * GET ALL ROLES
 */
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();

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

    const role = await Role.findByPk(id);
    if (!role) {
      return sendResponse(res, 404, false, 'Role not found');
    }

    return sendResponse(res, 200, true, 'Role fetched', role);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * UPDATE ROLE
 */
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return sendResponse(res, 404, false, 'Role not found');
    }

    await role.update({ name, description });

    return sendResponse(res, 200, true, 'Role updated', role);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * DELETE ROLE
 */
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return sendResponse(res, 404, false, 'Role not found');
    }

    await role.destroy();

    return sendResponse(res, 200, true, 'Role deleted');
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
