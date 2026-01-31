const { StatusCodes } = require('http-status-codes');
const { getTeacherById: getTeacherByIdService } = require('../../services');
const { sendResponse } = require('../../utils/response');

module.exports = async function getTeacherById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await getTeacherByIdService(id);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, 'Teacher fetched successfully', { teacher: result.data });
  } catch (error) {
    next(error);
  }
};
