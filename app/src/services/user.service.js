const bcrypt = require('bcrypt');
const { User, Role, UserRole } = require('../models');
const { getEnumValues, ROLE } = require('../constants/enums');
const { getPagination, getPagingData } = require('../utils/pagination');

// Create user
async function createUser(userData) {
  const { firstName, lastName, email, password, userType } = userData;
  if (!firstName || !lastName || !email || !password) {
    return {
      success: false,
      message: 'First name, last name, email, and password are required',
    };
  }
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return {
      success: false,
      message: 'Email already exists',
    };
  }

  // Transaction for User + Default Role
  const result = await User.sequelize.transaction(async (t) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
    }, { transaction: t });

    // Assign default USER role
    const [defaultRole] = await Role.findOrCreate({ 
        where: { name: ROLE.USER },
        defaults: { description: 'Regular User' },
        transaction: t
    });

    await UserRole.create({
        userId: newUser.id,
        roleId: defaultRole.id
    }, { transaction: t });

    return newUser;
  });

  return {
    success: true,
    message: 'User created successfully',
    data: result
  };
}

// Get all users (with roles)
async function getAllUsers(page = 0, size = 10) {
const { limit, offset } = getPagination(page, size);
  const { count, rows } = await User.findAndCountAll({
  distinct: true,
  attributes: { exclude: ['password'] },
  limit,
  offset,
  order: [['createdAt', 'DESC']],
  include: [
      {
        model: UserRole,          
        attributes: ['id', 'roleId'], 
        include: [
          {
            model: Role,            
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  });

  const items = rows.map(user => {
  const userJson = user.toJSON();
  userJson.roles = userJson.UserRoles
    ? userJson.UserRoles.map(ur => ur.Role.name)
    : [];
  delete userJson.UserRoles; 
  return userJson;
});

  return {
    success: true,
    data: getPagingData({ count, rows: items }, page, limit),
  };
}

// Get user by ID (with roles)
async function getUserById(id) {
  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ['password'] },
    include: [
      {
        model: UserRole,
        attributes: ['id', 'roleId'],
        include: [
          {
            model: Role,
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  });
  
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  const userJson = user.toJSON();
  // Flatten roles from UserRoles, always map over an array
  userJson.roles = Array.isArray(userJson.UserRoles)
    ? userJson.UserRoles.map(ur => ur.Role && ur.Role.name).filter(Boolean)
    : [];
  delete userJson.UserRoles;
  return { success: true, data: userJson };
}

// Update user
async function updateUser(data) {
  const { id, firstName, lastName, status, userType } = data;
  const user = await User.findByPk(id);
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  await user.update({ firstName, lastName, status, userType });
  return { success: true, message: 'User updated', data: user };
}

// Delete user
async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  await user.destroy();
  return { success: true, data: user };
}

// Assign role to user
async function assignRole(userId, roleName) {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    const validRoles = getEnumValues(require('../constants/enums').ROLE);
    if (!validRoles.includes(roleName)) {
      return { success: false, message: `Invalid role. Allowed roles: ${validRoles.join(', ')}` };
    }
    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) {
      return { success: false, message: 'Role not found' };
    }
    const existingAssignment = await UserRole.findOne({ where: { userId: user.id, roleId: role.id } });
    if (existingAssignment) {
      return { success: false, message: 'Role already assigned to user' };
    }
    const userRole = await UserRole.create({ userId: user.id, roleId: role.id });
    return { 
      success: true, 
      message: 'Role assigned successfully', 
      data: { 
        userId: user.id, 
        role: role.name,
        assignedAt: userRole.createdAt
      } 
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Remove role from user
async function removeRole(userId, roleName) {
  const user = await User.findByPk(userId);
  if (!user) return { success: false, message: 'User not found' };
  const validRoles = getEnumValues(require('../constants/enums').ROLE);
  if (!validRoles.includes(roleName)) {
    return { success: false, message: `Invalid role. Allowed roles: ${validRoles.join(', ')}` };
  }
  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) return { success: false, message: 'Role not found' };
  const deleted = await UserRole.destroy({ where: { userId: user.id, roleId: role.id } });
  if (!deleted) return { success: false, message: 'Role assignment not found' };
  return { 
    success: true, 
    message: 'Role removed successfully',
    data: { 
      userId: user.id, 
      role: role.name 
    } 
  };
}

// Get all roles for a user
async function getUserRoles(userId) {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: UserRole,
        include: [
          {
            model: Role,
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  });
  if (!user) return { success: false, message: 'User not found' };
  // Return array of roles
  const roles = user.UserRoles ? user.UserRoles.map(ur => ur.Role && ur.Role.name).filter(Boolean) : [];
  return { success: true, message: 'Roles fetched', data: roles };
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignRole,
  removeRole,
  getUserRoles,
};
