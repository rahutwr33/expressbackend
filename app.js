const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config()
const app = express(); //create an express instance
const passport = require('passport')
var cors = require('cors')

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
require('./config/passport')(passport);
// view engine setup
app.set('views', path.join(__dirname, 'views'));  //set path of ejs template folder
app.set('view engine', 'ejs');   //template registed with app
app.use(logger('dev'));   //logger register
app.use(cors())

app.use(passport.initialize());

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());  //parse cookie
app.use(express.static(path.join(__dirname, 'public')));  //set static path of public folder
app.use('/upload', express.static(__dirname + "/uploads"));

app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use('/user', passport.authenticate('jwt', { session: false }), userRouter);
app.use('/product',  productRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
