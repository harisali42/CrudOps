const sequelize = require('../config/database');

const User = require('./user.model');
const Role = require('./role.model');
const UserRole = require('./userRole.model');
const Session = require('./session.model');

// User ↔ Role (Many-to-Many)
// User.belongsToMany(Role, {
//   through: UserRole,
//   foreignKey: 'userId',
// });
// Role.belongsToMany(User, {
//   through: UserRole,
//   foreignKey: 'roleId',
// });

// User ↔ UserRole ↔ Role
User.hasMany(UserRole, { foreignKey: 'userId' });
UserRole.belongsTo(User, { foreignKey: 'userId' });

Role.hasMany(UserRole, { foreignKey: 'roleId' });
UserRole.belongsTo(Role, { foreignKey: 'roleId' });


// User → Session (One-to-Many)
User.hasMany(Session, { foreignKey: 'userId' });
Session.belongsTo(User, { foreignKey: 'userId' });

const db = {
  sequelize,
  User,
  Role,
  UserRole,
  Session,
};

module.exports = db;
