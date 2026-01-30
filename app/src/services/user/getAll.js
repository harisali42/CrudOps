const { User } = require('../../models');
const { getPagination, getPagingData } = require('../../utils/pagination');

module.exports = async (page = 0, size = 10) => {
  const { limit, offset } = getPagination(page, size);
  const data = await User.findAndCountAll({
    attributes: { exclude: ['password'] },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
  return { success: true, data: getPagingData(data, page, limit) };
};
