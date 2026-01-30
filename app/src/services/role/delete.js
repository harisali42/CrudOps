const { Role } = require('../../models');

module.exports = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) {
    return { success: false, message: 'Role not found' };
  }
  await role.destroy();
  return { success: true, message: 'Role deleted', data: role };
};
