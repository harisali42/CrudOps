const { StatusCodes } = require('http-status-codes');
const { deleteClass: deleteClassService } = require('../../services/class.service');
const { sendResponse } = require('../../utils/response');

module.exports = async function deleteClass(req, res, next) {
  try {
    const { id } = req.params;
    const result = await deleteClassService(id);
    if (!result.success) {
      return sendResponse(res, StatusCodes.NOT_FOUND, false, result.message);
    }
    return sendResponse(res, StatusCodes.OK, true, result.message, { class: result.data });
  } catch (error) {
    next(error);
  }
};
