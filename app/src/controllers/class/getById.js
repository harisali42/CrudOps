const { StatusCodes } = require('http-status-codes');
const { getClassById: getClassByIdService } = require('../../services/class.service');
const { sendResponse } = require('../../utils/response');

module.exports = async function getClassById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await getClassByIdService(id);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, 'Class fetched successfully', { class: result.data });
  } catch (error) {
    next(error);
  }
};
