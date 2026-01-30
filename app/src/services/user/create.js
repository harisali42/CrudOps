const bcrypt = require('bcrypt');
const { User } = require('../../models');

module.exports = async (userData) => {
  const { firstName, lastName, email, password } = userData;
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

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  return {
    success: true,
    message: 'User created successfully',
    data: newUser
  };
};
