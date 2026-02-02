const { StatusCodes } = require('http-status-codes');
const { getAllClasses: getAllClassesService } = require('../../services/class.service');
const { sendResponse } = require('../../utils/response');

module.exports = async function getAllClasses(req, res, next) {
  try {
    const result = await getAllClassesService();
    return sendResponse(res, StatusCodes.OK, true, 'Classes fetched successfully', { classes: result.data });
  } catch (error) {
    next(error);
  }
};
