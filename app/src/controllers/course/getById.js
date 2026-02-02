const { StatusCodes } = require('http-status-codes');
const { getCourseById: getCourseByIdService } = require('../../services/course.service');
const { sendResponse } = require('../../utils/response');

module.exports = async function getCourseById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await getCourseByIdService(id);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, 'Course fetched successfully', { course: result.data });
  } catch (error) {
    next(error);
  }
};
