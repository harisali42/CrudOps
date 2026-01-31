const { Teacher, User, UserRole, Role } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');

// Create teacher
async function createTeacher(data) {
  const { userId, employeeNumber, hireDate, resignationDate } = data;
  if (!userId || !employeeNumber || !hireDate) {
    return { success: false, message: 'userId, employeeNumber, and hireDate are required' };
  }

  const existing = await Teacher.findOne({ where: { userId } });
  if (existing) return { success: false, message: 'Teacher already exists for this user' };

  const teacher = await Teacher.create({ userId, employeeNumber, hireDate, resignationDate });
  return { success: true, message: 'Teacher created', data: teacher };
}

// Get all teachers with user info and roles
async function getAllTeachers(page = 0, size = 10) {
  const { limit, offset } = getPagination(page, size);

  const { count, rows } = await Teacher.findAndCountAll({
    attributes: ['id', 'employeeNumber', 'hireDate', 'resignationDate', 'createdAt', 'updatedAt'],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'email', 'status'],
        include: [
          {
            model: UserRole,
            attributes: ['id', 'roleId'],
            include: [{ model: Role, attributes: ['id', 'name'] }]
          }
        ]
      }
    ]
  });

  const items = rows.map(teacher => {
    const t = teacher.toJSON();
    if (t.User && t.User.UserRoles) {
      t.roles = t.User.UserRoles.map(ur => ur.Role && ur.Role.name).filter(Boolean);
    } else {
      t.roles = [];
    }
    t.user = t.User || null;
    delete t.User;
    return t;
  });

  return {
    success: true,
    data: getPagingData({ count, rows: items }, page, limit),
  };
}

// Get teacher by ID with user roles
async function getTeacherById(id) {
  const teacher = await Teacher.findByPk(id, {
    attributes: ['id', 'employeeNumber', 'hireDate', 'resignationDate', 'createdAt', 'updatedAt'],
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'email', 'status'],
        include: [
          {
            model: UserRole,
            attributes: ['id', 'roleId'],
            include: [{ model: Role, attributes: ['id', 'name'] }]
          }
        ]
      }
    ]
  });

  if (!teacher) return { success: false, message: 'Teacher not found' };

  const t = teacher.toJSON();
  t.roles = t.User && t.User.UserRoles
    ? t.User.UserRoles.map(ur => ur.Role && ur.Role.name).filter(Boolean)
    : [];
  t.user = t.User || null;
  delete t.User;

  return { success: true, data: t };
}

// Update teacher
async function updateTeacher(data) {
  const { id, employeeNumber, hireDate, resignationDate } = data;
  const teacher = await Teacher.findByPk(id);
  if (!teacher) return { success: false, message: 'Teacher not found' };

  await teacher.update({ employeeNumber, hireDate, resignationDate });
  return { success: true, message: 'Teacher updated', data: teacher };
}

// Delete teacher
async function deleteTeacher(id) {
  const teacher = await Teacher.findByPk(id);
  if (!teacher) return { success: false, message: 'Teacher not found' };

  await teacher.destroy();
  return { success: true, message: 'Teacher deleted', data: teacher };
}

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
