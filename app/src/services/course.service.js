const { Course, Student, Teacher, StudentCourse, TeacherCourse } = require('../models');

// Create course
async function createCourse(data) {
  const { name, code, description, credits } = data;
  const existing = await Course.findOne({ where: { code } });
  if (existing) return { success: false, message: 'Course code already exists' };

  const course = await Course.create({ name, code, description, credits });
  return { success: true, message: 'Course created', data: course };
}

// Get all courses
async function getAllCourses() {
  const courses = await Course.findAll();
  return { success: true, data: courses };
}

// Get by ID
async function getCourseById(id) {
  const course = await Course.findByPk(id, {
    include: [
      {
        model: TeacherCourse,
        include: [
          {
            model: Teacher,
            attributes: ['id', 'employeeId'],
          }
        ]
      },
      {
        model: StudentCourse,
        include: [
          {
            model: Student,
            attributes: ['id', 'rollNo'],
          }
        ]
      }
    ]
  });
  if (!course) return { success: false, message: 'Course not found' };

  const json = course.toJSON();
  
  // Transform Teachers
  json.teachers = json.TeacherCourses
    ? json.TeacherCourses.map(tc => tc.Teacher).filter(Boolean)
    : [];
  delete json.TeacherCourses;

  // Transform Students
  json.students = json.StudentCourses
    ? json.StudentCourses.map(sc => sc.Student).filter(Boolean)
    : [];
  delete json.StudentCourses;

  return { success: true, data: json };
}

// Update
async function updateCourse(id, data) {
  const course = await Course.findByPk(id);
  if (!course) return { success: false, message: 'Course not found' };

  await course.update(data);
  return { success: true, message: 'Course updated', data: course };
}

// Delete
async function deleteCourse(id) {
  const course = await Course.findByPk(id);
  if (!course) return { success: false, message: 'Course not found' };

  await course.destroy();
  return { success: true, message: 'Course deleted', data: course };
}

// Enroll Student
async function enrollStudent(studentId, courseId) {
  const student = await Student.findByPk(studentId);
  if (!student) return { success: false, message: 'Student not found' };

  const course = await Course.findByPk(courseId);
  if (!course) return { success: false, message: 'Course not found' };

  const existing = await StudentCourse.findOne({ where: { studentId, courseId } });
  if (existing) return { success: false, message: 'Student already enrolled in this course' };

  await StudentCourse.create({ studentId, courseId });
  return { success: true, message: 'Student enrolled in course' };
}

// Assign Teacher
async function assignTeacher(teacherId, courseId) {
  const teacher = await Teacher.findByPk(teacherId);
  if (!teacher) return { success: false, message: 'Teacher not found' };

  const course = await Course.findByPk(courseId);
  if (!course) return { success: false, message: 'Course not found' };

  const existing = await TeacherCourse.findOne({ where: { teacherId, courseId } });
  if (existing) return { success: false, message: 'Teacher already assigned to this course' };

  await TeacherCourse.create({ teacherId, courseId });
  return { success: true, message: 'Teacher assigned to course' };
}

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollStudent,
  assignTeacher,
};
