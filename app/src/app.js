const sequelize = require('./config/database');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const authRoutes = require('./routes/auth.routes');
const userRoleRoutes = require('./routes/userRole.routes');

require('./models');
require('./jobs'); // Initialize cron jobs

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



app.use(express.json());

app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/auth', authRoutes);
app.use('/user-roles', userRoleRoutes);


sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
  })
  .then(() => {
    console.log('Models synced');
    return sequelize.getQueryInterface().showAllTables();
  })
  .then((tables) => {
    console.log('Tables:', tables);
  })
  .catch((err) => {
    console.error(err);
  });



module.exports = app;
