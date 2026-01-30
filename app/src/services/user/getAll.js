const { User, Role } = require('../../models');
const { getPagination, getPagingData } = require('../../utils/pagination');

module.exports = async (page = 0, size = 10) => {
  const { limit, offset } = getPagination(page, size);
    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: Role, through: { attributes: [] } }],
    });

    // Map roles to a simple array of role names for each user
    const items = rows.map(user => {
      const userJson = user.toJSON();
      userJson.roles = userJson.Roles ? userJson.Roles.map(r => r.name) : [];
      delete userJson.Roles;
      return userJson;
    });

    return {
      success: true,
      data: getPagingData({ count, rows: items }, page, limit),
    };
  return { success: true, data: getPagingData(data, page, limit) };
};
