const { StatusCodes } = require('http-status-codes');
const { getAllStudents: getAllStudentsService } = require('../../services/student.service');
const { sendResponse } = require('../../utils/response');

module.exports = async function getAllStudents(req, res, next) {
  try {
    const { page, size } = req.query; // optional pagination
    const result = await getAllStudentsService(Number(page) || 0, Number(size) || 10);

    return sendResponse(
      res,
      StatusCodes.OK,
      true,
      'Students fetched successfully',
      result.data
    );
  } catch (error) {
    next(error);
  }
};
