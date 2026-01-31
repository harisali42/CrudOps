const { StatusCodes } = require('http-status-codes');
const { getAllTeachers: getAllTeachersService } = require('../../services');
const { sendResponse } = require('../../utils/response');

module.exports = async function getAllTeachers(req, res, next) {
  try {
    const { page, size } = req.query;
    const result = await getAllTeachersService(page, size);
    return sendResponse(res, StatusCodes.OK, true, 'Teachers fetched successfully', result.data);
  } catch (error) {
    next(error);
  }
};
