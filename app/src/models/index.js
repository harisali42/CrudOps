
const sequelize = require('../config/database');

const User = require('./user.model');
const Role = require('./role.model');
const UserRole = require('./userRole.model');
const Session = require('./session.model');
const Student = require('./student.model');
const Teacher = require('./teacher.model');
const Class = require('./class.model');
const Course = require('./course.model');
const StudentCourse = require('./studentCourse.model');
const TeacherCourse = require('./teacherCourse.model');
const TeacherClass = require('./teacherClass.model');

// User → Role (Many-to-Many through UserRole)
User.hasMany(UserRole, { foreignKey: 'userId' });
UserRole.belongsTo(User, { foreignKey: 'userId' });

Role.hasMany(UserRole, { foreignKey: 'roleId' });
UserRole.belongsTo(Role, { foreignKey: 'roleId' });

// User → Student (One-to-One)
User.hasOne(Student, { foreignKey: 'userId' });
Student.belongsTo(User, { foreignKey: 'userId' });

// User → Teacher (One-to-One)
User.hasOne(Teacher, { foreignKey: 'userId' });
Teacher.belongsTo(User, { foreignKey: 'userId' });

// User → Session (One-to-Many)
User.hasMany(Session, { foreignKey: 'userId' });
Session.belongsTo(User, { foreignKey: 'userId' });

// Class → Student (One-to-Many)
Class.hasMany(Student, { foreignKey: 'classId' });
Student.belongsTo(Class, { foreignKey: 'classId' });

// Student <-> Course (Many-to-Many through StudentCourse)
Student.hasMany(StudentCourse, { foreignKey: 'studentId' });
StudentCourse.belongsTo(Student, { foreignKey: 'studentId' });

Course.hasMany(StudentCourse, { foreignKey: 'courseId' });
StudentCourse.belongsTo(Course, { foreignKey: 'courseId' });

// Teacher <-> Course (Many-to-Many through TeacherCourse)
Teacher.hasMany(TeacherCourse, { foreignKey: 'teacherId' });
TeacherCourse.belongsTo(Teacher, { foreignKey: 'teacherId' });

Course.hasMany(TeacherCourse, { foreignKey: 'courseId' });
TeacherCourse.belongsTo(Course, { foreignKey: 'courseId' });

// Teacher <-> Class (Many-to-Many through TeacherClass)
Teacher.hasMany(TeacherClass, { foreignKey: 'teacherId' });
TeacherClass.belongsTo(Teacher, { foreignKey: 'teacherId' });

Class.hasMany(TeacherClass, { foreignKey: 'classId' });
TeacherClass.belongsTo(Class, { foreignKey: 'classId' });


const models = {
  sequelize,
  User,
  Role,
  UserRole,
  Session,
  Student,
  Teacher,
  Class,
  Course,
  StudentCourse,
  TeacherCourse,
  TeacherClass,
};

module.exports = models;
