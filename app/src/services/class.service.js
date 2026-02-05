const { Class, Teacher, Student, TeacherClass } = require('../models');

// Create class
async function createClass(data) {
  const { name, roomNumber, capacity } = data;
  const existing = await Class.findOne({ where: { name, deletedAt: null } });
  if (existing) return { success: false, message: 'Class name already exists' };

  const newClass = await Class.create({ name, roomNumber, capacity });
  return { success: true, message: 'Class created', data: newClass };
}

// Get all classes
async function getAllClasses() {
  const classes = await Class.findAll({
    include: [
      {
        model: TeacherClass,
        include: [
          {
            model: Teacher,
            attributes: ['id', 'employeeId'],
          }
        ]
      }
    ]
  });

  const data = classes.map(c => {
    const json = c.toJSON();
    json.teachers = json.TeacherClasses 
      ? json.TeacherClasses.map(tc => tc.Teacher).filter(Boolean) 
      : [];
    delete json.TeacherClasses;
    return json;
  });

  return { success: true, data };
}

// Get by ID
async function getClassById(id) {
  const classItem = await Class.findByPk(id, {
    include: [
      {
        model: TeacherClass,
        include: [
          {
            model: Teacher,
            attributes: ['id', 'employeeId'],
          }
        ]
      },
      {
        model: Student, // Students in this class
        attributes: ['id', 'rollNo', 'userId'],
      }
    ]
  });
  if (!classItem) return { success: false, message: 'Class not found' };

  const json = classItem.toJSON();
  
  // Transform Teachers
  json.teachers = json.TeacherClasses 
    ? json.TeacherClasses.map(tc => tc.Teacher).filter(Boolean) 
    : [];
  delete json.TeacherClasses;

  // Transform Students
  json.students = json.Students ? json.Students : [];
  delete json.Students;

  return { success: true, data: json };
}

// Update
async function updateClass(id, data) {
  const classItem = await Class.findByPk(id);
  if (!classItem) return { success: false, message: 'Class not found' };
  
  await classItem.update(data);
  return { success: true, message: 'Class updated', data: classItem };
}

// Delete
async function deleteClass(id) {
  const classItem = await Class.findByPk(id);
  if (!classItem) return { success: false, message: 'Class not found' };

  await classItem.destroy();
  return { success: true, message: 'Class deleted', data: classItem };
}

// Assign Student to Class
async function assignStudentToClass(studentId, classId) {
  const student = await Student.findByPk(studentId);
  if (!student) return { success: false, message: 'Student not found' };

  const classItem = await Class.findByPk(classId);
  if (!classItem) return { success: false, message: 'Class not found' };

  student.classId = classId;
  await student.save();

  return { success: true, message: 'Student assigned to class' };
}

// Assign Teacher to Class
async function assignTeacherToClass(teacherId, classId) {
  const teacher = await Teacher.findByPk(teacherId);
  if (!teacher) return { success: false, message: 'Teacher not found' };

  const classItem = await Class.findByPk(classId);
  if (!classItem) return { success: false, message: 'Class not found' };

  // Explicitly creating the junction record
  const existing = await TeacherClass.findOne({ where: { teacherId, classId } });
  if (existing) {
    return { success: false, message: 'Teacher already assigned to this class' };
  }

  await TeacherClass.create({ teacherId, classId });
  return { success: true, message: 'Teacher assigned to class' };
}

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignStudentToClass,
  assignTeacherToClass,
};
