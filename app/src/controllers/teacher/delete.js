const { StatusCodes } = require('http-status-codes');
const { deleteTeacher: deleteTeacherService } = require('../../services');
const { sendResponse } = require('../../utils/response');

module.exports = async function deleteTeacher(req, res, next) {
  try {
    const { id } = req.params;
    const result = await deleteTeacherService(id);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, 'Teacher deleted successfully', { teacher: result.data });
  } catch (error) {
    next(error);
  }
};
