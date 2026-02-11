const { Student, User, UserRole, Role, Class, Course, StudentCourse, Department } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');
const { ROLE } = require('../constants/enums');

// Create student
async function createStudent(data) {
  const { userId, rollNo, admissionDate, classId } = data; // Added classId
  if (!userId || !rollNo || !admissionDate) {
    return { success: false, message: 'userId, rollNo, and admissionDate are required' };
  }

  const existing = await Student.findOne({ where: { userId }, paranoid: false });
  if (existing) {
    if (existing.deletedAt) {
      return { success: false, message: 'Student profile was deleted previously. Please contact admin to restore.' };
    }
    return { success: false, message: 'Student profile already exists for this user' };
  }
  
  const existingRoll = await Student.findOne({ where: { rollNo }, paranoid: false });
  if (existingRoll) {
     if (existingRoll.deletedAt) {
      return { success: false, message: 'This Roll Number belongs to a deleted student.' };
    }
    return { success: false, message: 'Student with this Roll Number already exists' };
  }

  // Generate student transaction
  const result = await Student.sequelize.transaction(async (t) => {
    // 1. Create the Student profile
    const student = await Student.create({ userId, rollNo, admissionDate, classId }, { transaction: t });

    // 2. Find or Create the STUDENT role
    const [studentRole] = await Role.findOrCreate({ 
      where: { name: ROLE.STUDENT },
      defaults: { description: 'Student Role' },
      transaction: t 
    });

    // 3. Assign the STUDENT role to the User
    await UserRole.findOrCreate({
      where: { userId, roleId: studentRole.id },
      transaction: t
    });

    return student;
  });

  return { success: true, message: 'Student created', data: result };
}

// Get all students with user info and roles
async function getAllStudents(page = 0, size = 10) {
  const { limit, offset } = getPagination(page, size);

  const { count, rows } = await Student.findAndCountAll({
    attributes: ['id', 'rollNo', 'admissionDate', 'createdAt', 'updatedAt', 'departmentId','classId'],
    limit,
    offset,
    distinct: true,
    order: [['createdAt', 'DESC']],
    include: [
       // Join 0: Department (BelongsTo)
      {
        model: Department,
        attributes: ['name'],
      },
       // Join 1: Get the Class details (One-to-Many)
      {
        model: Class,
        attributes: ['name'],
      },
      {
        // Join 2: Get Enrolled Courses
        model: StudentCourse,
        include: [
          {
            model: Course,
            attributes: ['id', 'name', 'code'],
          }
        ]
      },
      {
        // Join 3: Get User details (One-to-One)
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

    // Flatten Class
    s.class_name = s.Class ? s.Class.name : null;
    delete s.Class;

    // Flatten Department
    s.department_name = s.Department ? s.Department.name : null;
    delete s.Department;
    
    // Map Courses
    s.courses = s.StudentCourses 
      ? s.StudentCourses.map(sc => sc.Course).filter(Boolean)
      : [];
    delete s.StudentCourses;

    if (s.User && s.User.UserRoles) {
      s.roles = s.User.UserRoles.map(ur => ur.Role && ur.Role.name).filter(Boolean);
      delete s.User.UserRoles; // Remove raw UserRoles from user object
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
    attributes: ['id', 'rollNo', 'admissionDate', 'createdAt', 'updatedAt', 'classId', 'departmentId'],
    include: [
      {
        model: Department,
        attributes: ['id', 'name', 'code'],
      },
      {
        model: Class,
        attributes: ['name'],
      },
      {
        model: StudentCourse,
        include: [
          {
            model: Course,
            attributes: ['id', 'name', 'code'],
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

  if (!student) return { success: false, message: 'Student not found' };

  const s = student.toJSON();

  // Flatten Class
  s.class_name = s.Class ? s.Class.name : null;
  delete s.Class;

  // Flatten Department
  s.department_name = s.Department ? s.Department.name : null;
  delete s.Department;

  // Map Courses
  s.courses = s.StudentCourses 
    ? s.StudentCourses.map(sc => sc.Course).filter(Boolean)
    : [];
  delete s.StudentCourses;

  s.roles = s.User && s.User.UserRoles
    ? s.User.UserRoles.map(ur => ur.Role && ur.Role.name).filter(Boolean)
    : [];

  if (s.User) {
    delete s.User.UserRoles; // Remove raw UserRoles from user object
  }

  s.user = s.User || null;
  delete s.User;

  return { success: true, data: s };
}

// Update student
async function updateStudent(data) {
  const { id, rollNo, admissionDate, classId } = data;
  const student = await Student.findByPk(id);
  if (!student) return { success: false, message: 'Student not found' };

  await student.update({ rollNo, admissionDate, classId });
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
