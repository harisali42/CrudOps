const { Role } = require('../../models');

module.exports = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) {
    return { success: false, message: 'Role not found' };
  }
  return { success: true, data: role };
};
