
const sendResponse = (res, status, success, message, data = null) => {
  const response = {
    success,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(status).json(response);
};

module.exports = { sendResponse };