const bcrypt = require('bcrypt');
const { User, Role, UserRole } = require('../models');
const { getEnumValues, ROLE } = require('../constants/enums');
const { getPagination, getPagingData } = require('../utils/pagination');

// ---Create user---
async function createUser(userData) {
  const { firstName, lastName, email, password, userType } = userData;

  if (!firstName || !lastName || !email || !password) {
    return {
      success: false,
      message: 'First name, last name, email, and password are required',
    };
  }

  //  Check if email already exists
  const checkEmailQuery = `
    SELECT id
    FROM users
    WHERE email = '${email}';
  `;

  const existingUser = await User.sequelize.query(checkEmailQuery, {
    type: User.sequelize.QueryTypes.SELECT,
  });

  if (existingUser.length > 0) {
    return {
      success: false,
      message: 'Email already exists',
    };
  }

  //  Hash password (JS responsibility)
  const hashedPassword = await bcrypt.hash(password, 10);

  //  Start transaction
  const transaction = await User.sequelize.transaction();

  try {
    //  Insert user
    const insertUserQuery = `
      INSERT INTO users
        (firstName, lastName, email, password, userType, createdAt, updatedAt)
      VALUES
        ('${firstName}', '${lastName}', '${email}', '${hashedPassword}', '${userType}', NOW(), NOW());
    `;

    const insertResult = await User.sequelize.query(insertUserQuery, {
      transaction,
      type: User.sequelize.QueryTypes.INSERT,
    });

    const newUserId = insertResult[0];

    //  Get or create default USER role
    const roleQuery = `
      SELECT id
      FROM roles
      WHERE name = '${ROLE.USER}';
    `;

    let roleResult = await User.sequelize.query(roleQuery, {
      transaction,
      type: User.sequelize.QueryTypes.SELECT,
    });

    let roleId;

    if (roleResult.length === 0) {
      const insertRoleQuery = `
        INSERT INTO roles (name, description, createdAt, updatedAt)
        VALUES ('${ROLE.USER}', 'Regular User', NOW(), NOW());
      `;

      const roleInsertResult = await User.sequelize.query(insertRoleQuery, {
        transaction,
        type: User.sequelize.QueryTypes.INSERT,
      });

      roleId = roleInsertResult[0];
    } else {
      roleId = roleResult[0].id;
    }

    //  Assign role to user
    const assignRoleQuery = `
      INSERT INTO user_roles (userId, roleId, createdAt, updatedAt)
      VALUES (${newUserId}, ${roleId}, NOW(), NOW());
    `;

    await User.sequelize.query(assignRoleQuery, {
      transaction,
      type: User.sequelize.QueryTypes.INSERT,
    });

    //  Commit transaction
    await transaction.commit();

    //  Fetch created user (without password)
    const fetchUserQuery = `
      SELECT
        id,
        firstName,
        lastName,
        email,
        userType,
        createdAt
      FROM users
      WHERE id = ${newUserId};
    `;

    const newUser = await User.sequelize.query(fetchUserQuery, {
      type: User.sequelize.QueryTypes.SELECT,
    });

    return {
      success: true,
      message: 'User created successfully',
      data: newUser[0],
    };

  } catch (error) {
    // Rollback on error
    await transaction.rollback();
    throw error;
  }
}


// ---Get all users (with roles)---
async function getAllUsers(page = 0, size = 10) {
  const limit = size;
  const offset = page * size;

  const query = `
    SELECT
      u.id,
      u.firstName,
      u.lastName,
      u.email,
      u.userType,
      u.status,
      u.createdAt,
      u.updatedAt,
      u.deletedAt,
      r.name AS roleName
    FROM users u
    LEFT JOIN user_roles ur ON ur.userId = u.id
    LEFT JOIN roles r ON r.id = ur.roleId
    ORDER BY u.createdAt DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  const countQuery = `
    SELECT COUNT(DISTINCT u.id) AS total
    FROM users u;
  `;

  const usersRows = await User.sequelize.query(query, {
    type: User.sequelize.QueryTypes.SELECT,
  });

  const countResult = await User.sequelize.query(countQuery, {
    type: User.sequelize.QueryTypes.SELECT,
  });

  const totalItems = countResult[0].total;

  const usersMap = {};

  usersRows.forEach(row => {
    if (!usersMap[row.id]) {
      usersMap[row.id] = {
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        userType: row.userType,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        deletedAt: row.deletedAt,
        roles: []
      };
    }

    if (row.roleName) {
      usersMap[row.id].roles.push(row.roleName);
    }
  });

  return {
    success: true,
    data: {
      totalItems,
      users: Object.values(usersMap),
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit)
    }
  };
}

// ---Get user by ID (with roles)---
async function getUserById(id) {
  const query = `
    SELECT
      u.id,
      u.firstName,
      u.lastName,
      u.email,
      u.userType,
      u.status,
      u.createdAt,
      u.updatedAt,
      u.deletedAt,
      r.name AS roleName
    FROM users u
    LEFT JOIN user_roles ur ON ur.userId = u.id
    LEFT JOIN roles r ON r.id = ur.roleId
    WHERE u.id = ${id};
  `;

  const rows = await User.sequelize.query(query, {
    type: User.sequelize.QueryTypes.SELECT,
  });

  if (!rows || rows.length === 0) {
    return { success: false, message: 'User not found' };
  }

  // Build user object + roles
  const user = {
    id: rows[0].id,
    firstName: rows[0].firstName,
    lastName: rows[0].lastName,
    email: rows[0].email,
    userType: rows[0].userType,
    status: rows[0].status,
    createdAt: rows[0].createdAt,
    updatedAt: rows[0].updatedAt,
    deletedAt: rows[0].deletedAt,
    roles: []
  };

  rows.forEach(row => {
    if (row.roleName) {
      user.roles.push(row.roleName);
    }
  });

  return {
    success: true,
    data: user
  };
}


// ---Update user---
async function updateUser(data) {
  const { id, firstName, lastName, status, userType } = data;

  //  Check if user exists
  const checkQuery = `
    SELECT id
    FROM users
    WHERE id = ${id};
  `;

  const existingUser = await User.sequelize.query(checkQuery, {
    type: User.sequelize.QueryTypes.SELECT,
  });

  if (!existingUser || existingUser.length === 0) {
    return { success: false, message: 'User not found' };
  }

  //  Update
  const updateQuery = `
    UPDATE users
    SET
      firstName = '${firstName}',
      lastName = '${lastName}',
      status = '${status}',
      userType = '${userType}',
      updatedAt = NOW()
    WHERE id = ${id};
  `;

  await User.sequelize.query(updateQuery, {
    type: User.sequelize.QueryTypes.UPDATE,
  });

  // Fetch updated user (without password)
  const fetchQuery = `
    SELECT
      id,
      firstName,
      lastName,
      email,
      status,
      userType,
      createdAt,
      updatedAt
    FROM users
    WHERE id = ${id};
  `;

  const updatedUser = await User.sequelize.query(fetchQuery, {
    type: User.sequelize.QueryTypes.SELECT,
  });

  return {
    success: true,
    message: 'User updated',
    data: updatedUser[0],
  };
}


// ---Delete user---
async function deleteUser(id) {
  //  Check if user exists
  const findUserQuery = `
    SELECT
      id,
      firstName,
      lastName,
      email,
      userType,
      createdAt
    FROM users
    WHERE id = ${id};
  `;

  const users = await User.sequelize.query(findUserQuery, {
    type: User.sequelize.QueryTypes.SELECT,
  });

  if (users.length === 0) {
    return { success: false, message: 'User not found' };
  }

  const user = users[0];

  //  Delete user
  const deleteUserQuery = `
    DELETE FROM users
    WHERE id = ${id};
  `;

  await User.sequelize.query(deleteUserQuery, {
    type: User.sequelize.QueryTypes.DELETE,
  });

  // Return deleted user data
  return {
    success: true,
    data: user,
  };
}



// ---Assign role to user---
async function assignRole(userId, roleName) {
  try {
    /*  Check if user exists */
    const userQuery = `
      SELECT id
      FROM users
      WHERE id = ${userId};
    `;

    const users = await User.sequelize.query(userQuery, {
      type: User.sequelize.QueryTypes.SELECT,
    });

    if (users.length === 0) {
      return { success: false, message: 'User not found' };
    }

    /*  Validate role name (JS-side, same as before) */
    const validRoles = getEnumValues(require('../constants/enums').ROLE);
    if (!validRoles.includes(roleName)) {
      return {
        success: false,
        message: `Invalid role. Allowed roles: ${validRoles.join(', ')}`,
      };
    }

    /*  Get role by name */
    const roleQuery = `
      SELECT id, name
      FROM roles
      WHERE name = '${roleName}';
    `;

    const roles = await User.sequelize.query(roleQuery, {
      type: User.sequelize.QueryTypes.SELECT,
    });

    if (roles.length === 0) {
      return { success: false, message: 'Role not found' };
    }

    const role = roles[0];

    /*  Check if role already assigned */
    const checkAssignmentQuery = `
      SELECT id
      FROM user_roles
      WHERE userId = ${userId}
        AND roleId = ${role.id};
    `;

    const existing = await User.sequelize.query(checkAssignmentQuery, {
      type: User.sequelize.QueryTypes.SELECT,
    });

    if (existing.length > 0) {
      return { success: false, message: 'Role already assigned to user' };
    }

    /*  Assign role */
    const assignRoleQuery = `
      INSERT INTO user_roles (userId, roleId)
      VALUES (${userId}, ${role.id});
    `;

    await User.sequelize.query(assignRoleQuery, {
      type: User.sequelize.QueryTypes.INSERT,
    });

    return {
      success: true,
      message: 'Role assigned successfully',
      data: {
        userId,
        role: role.name,
        assignedAt: new Date(),
      },
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
