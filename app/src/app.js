const sequelize = require('./config/database');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const authRoutes = require('./routes/auth.routes');






require('./models');


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


sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync({ alter: true });
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
