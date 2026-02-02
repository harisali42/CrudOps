const { StatusCodes } = require('http-status-codes');
const { getAllCourses: getAllCoursesService } = require('../../services/course.service');
const { sendResponse } = require('../../utils/response');

module.exports = async function getAllCourses(req, res, next) {
  try {
    const result = await getAllCoursesService();
    return sendResponse(res, StatusCodes.OK, true, 'Courses fetched successfully', { courses: result.data });
  } catch (error) {
    next(error);
  }
};
