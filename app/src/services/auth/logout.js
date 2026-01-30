const { Session } = require('../../models');

module.exports = async (sessionId) => {
  if (!sessionId) {
    return { success: false, message: 'Session ID missing' };
  }

  const session = await Session.findOne({
    where: {
      id: sessionId,
      isValid: true,
    },
  });

  if (!session) {
    return { success: false, message: 'Session already logged out or invalid' };
  }

  session.isValid = false;
  await session.save();

  return { success: true, data: session };
};
