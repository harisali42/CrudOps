const { Role } = require('../../models');

module.exports = async (data) => {
  const { id, name, description } = data;
  const role = await Role.findByPk(id);
  if (!role) {
    return {
      success: false,
      message: 'Role not found',
      data: null
    };
  }
  await role.update({ name, description });
  return {
    success: true,
    data: role
  };
};
