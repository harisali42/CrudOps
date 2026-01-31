
const sequelize = require('../config/database');

const User = require('./user.model');
const Role = require('./role.model');
const UserRole = require('./userRole.model');
const Session = require('./session.model');
const Student = require('./student.model');
const Teacher = require('./teacher.model');

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

const models = {
  sequelize,
  User,
  Role,
  UserRole,
  Session,
  Student,
  Teacher,
};

module.exports = models;
