const { Teacher, User, UserRole, Role, Course, Class, TeacherClass, TeacherCourse, Department } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');
const { ROLE } = require('../constants/enums');

// Create teacher
async function createTeacher(data) {
  const { userId, employeeId, department } = data;
  if (!userId || !employeeId) {
    return { success: false, message: 'userId and employeeId are required' };
  }

  const existing = await Teacher.findOne({ where: { userId }, paranoid: false });
  if (existing) {
    if (existing.deletedAt) {
      return { success: false, message: 'Teacher profile was deleted previously. Please contact admin to restore.' };
    }
    return { success: false, message: 'Teacher profile already exists for this user' };
  }

  const existingEmployeeId = await Teacher.findOne({ where: { employeeId }, paranoid: false });
  if (existingEmployeeId) {
    if (existingEmployeeId.deletedAt) {
      return { success: false, message: 'This Employee ID belongs to a deleted teacher.' };
    }
    return { success: false, message: 'Teacher with this Employee ID already exists' };
  }

  // Generate teacher transaction
  const result = await Teacher.sequelize.transaction(async (t) => {
    // 1. Create Teacher profile 
    const teacher = await Teacher.create({ userId, employeeId, department }, { transaction: t });

    // 2. Find or Create TEACHER role
    const [teacherRole] = await Role.findOrCreate({ 
      where: { name: ROLE.TEACHER },
      defaults: { description: 'Teacher Role' },
      transaction: t
    });

    // 3. Assign TEACHER role to User
    await UserRole.findOrCreate({
      where: { userId, roleId: teacherRole.id },
      transaction: t
    });

    return teacher;
  });

  return { success: true, message: 'Teacher created', data: result };
}

// Get all teachers with user info and roles
async function getAllTeachers(page = 0, size = 10) {
  const { limit, offset } = getPagination(page, size);

  const { count, rows } = await Teacher.findAndCountAll({
    attributes: ['id', 'employeeId', 'departmentId', 'createdAt', 'updatedAt'],
    limit,
    offset,
    distinct: true,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Department,
        attributes: ['id', 'name', 'code'],
      },
      {
        model: TeacherCourse,
        include: [
          {
            model: Course,
            attributes: ['id', 'name', 'code'],
          }
        ]
      },
      {
        model: TeacherClass,
        include: [
          {
            model: Class,
            attributes: ['id', 'name'],
          }
        ]
      },
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
    
    // Flatten Department
    t.department_name = t.Department ? t.Department.name : null;
    delete t.Department;

    // Map Courses
    t.courses = t.TeacherCourses
      ? t.TeacherCourses.map(tc => tc.Course).filter(Boolean)
      : [];
    delete t.TeacherCourses;

    // Map Classes
    t.classes = t.TeacherClasses
      ? t.TeacherClasses.map(tc => tc.Class).filter(Boolean)
      : [];
    delete t.TeacherClasses;

    if (t.User && t.User.UserRoles) {
      t.roles = t.User.UserRoles.map(ur => ur.Role && ur.Role.name).filter(Boolean);
      delete t.User.UserRoles;
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
    attributes: ['id', 'employeeId', 'departmentId', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Department,
        attributes: ['id', 'name', 'code'],
      },
      {
        model: TeacherCourse,
        include: [
          {
            model: Course,
            attributes: ['id', 'name', 'code'],
          }
        ]
      },
      {
        model: TeacherClass,
        include: [
          {
            model: Class,
            attributes: ['id', 'name'],
          }
        ]
      },
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
  
  // Flatten Department
  t.department_name = t.Department ? t.Department.name : null;
  delete t.Department;

  // Map Courses
  t.courses = t.TeacherCourses
    ? t.TeacherCourses.map(tc => tc.Course).filter(Boolean)
    : [];
  delete t.TeacherCourses;

  // Map Classes
  t.classes = t.TeacherClasses
    ? t.TeacherClasses.map(tc => tc.Class).filter(Boolean)
    : [];
  delete t.TeacherClasses;

  t.roles = t.User && t.User.UserRoles
    ? t.User.UserRoles.map(ur => ur.Role && ur.Role.name).filter(Boolean)
    : [];
  
  if (t.User) delete t.User.UserRoles;

  t.user = t.User || null;
  delete t.User;

  return { success: true, data: t };
}

// Update teacher
async function updateTeacher(data) {
  const { id, employeeId, department } = data;
  const teacher = await Teacher.findByPk(id);
  if (!teacher) return { success: false, message: 'Teacher not found' };

  await teacher.update({ employeeId, department });
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
