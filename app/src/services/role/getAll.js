const { Role } = require('../../models');

module.exports = async () => {
  const roles = await Role.findAll();
  return { success: true, message: 'Roles fetched', data: roles };
};
