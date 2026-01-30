
const sendResponse = (res, status, success, message, data = {}) => {
  return res.status(status).json({
    message,
    data: {
      success,
      ...data
    }
  });
};

module.exports = { sendResponse };
//   return res.status(status).json({
//     message,
//     data{
//        success
//     },
//   });