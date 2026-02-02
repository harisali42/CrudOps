const { StatusCodes } = require('http-status-codes');
const { deleteCourse: deleteCourseService } = require('../../services/course.service');
const { sendResponse } = require('../../utils/response');

module.exports = async function deleteCourse(req, res, next) {
  try {
    const { id } = req.params;
    const result = await deleteCourseService(id);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { course: result.data });
  } catch (error) {
    next(error);
  }
};
