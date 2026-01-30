const { Role } = require('../../models');

module.exports = async ({ name, description }) => {
  if (!name) {
    return { success: false, message: 'Role name is required' };
  }
  const existingRole = await Role.findOne({ where: { name } });
  if (existingRole) {
    return { success: false, message: 'Role already exists' };
  }
  const newRole = await Role.create({ name, description });
  return { success: true, data: newRole };
};
