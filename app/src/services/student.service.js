const { Student, User, UserRole, Role } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');

// Create student
async function createStudent(data) {
  const { userId, rollNo, admissionDate } = data;
  if (!userId || !rollNo || !admissionDate) {
    return { success: false, message: 'userId, rollNo, and admissionDate are required' };
  }

  const existing = await Student.findOne({ where: { userId } });
  if (existing) return { success: false, message: 'Student already exists for this user' };

  const student = await Student.create({ userId, rollNo, admissionDate });
  return { success: true, message: 'Student created', data: student };
}

// Get all students with user info and roles
async function getAllStudents(page = 0, size = 10) {
  const { limit, offset } = getPagination(page, size);

  const { count, rows } = await Student.findAndCountAll({
    attributes: ['id', 'rollNo', 'admissionDate', 'createdAt', 'updatedAt'],
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
            include: [
              { model: Role, attributes: ['id', 'name'] }
            ]
          }
        ]
      }
    ]
  });

  // Flatten roles
  const items = rows.map(student => {
    const s = student.toJSON();
    if (s.User && s.User.UserRoles) {
      s.roles = s.User.UserRoles.map(ur => ur.Role && ur.Role.name).filter(Boolean);
    } else {
      s.roles = [];
    }
    s.user = s.User || null;
    delete s.User;
    return s;
  });

  return {
    success: true,
    data: getPagingData({ count, rows: items }, page, limit),
  };
}

// Get student by ID with user roles
async function getStudentById(id) {
  const student = await Student.findByPk(id, {
    attributes: ['id', 'rollNo', 'admissionDate', 'createdAt', 'updatedAt'],
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

  if (!student) return { success: false, message: 'Student not found' };

  const s = student.toJSON();
  s.roles = s.User && s.User.UserRoles
    ? s.User.UserRoles.map(ur => ur.Role && ur.Role.name).filter(Boolean)
    : [];
  s.user = s.User || null;
  delete s.User;

  return { success: true, data: s };
}

// Update student
async function updateStudent(data) {
  const { id, rollNo, admissionDate } = data;
  const student = await Student.findByPk(id);
  if (!student) return { success: false, message: 'Student not found' };

  await student.update({ rollNo, admissionDate });
  return { success: true, message: 'Student updated', data: student };
}

// Delete student
async function deleteStudent(id) {
  const student = await Student.findByPk(id);
  if (!student) return { success: false, message: 'Student not found' };

  await student.destroy();
  return { success: true, message: 'Student deleted', data: student };
}

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
