require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const rateLimit = require('express-rate-limit');
var cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

var usersRouter = require('./routes/users');
var donutsRouter = require('./routes/donuts');

var app = express();

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 50,
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(limiter);

app.use('/API/v1/users', usersRouter);
app.use('/API/v1/donuts', donutsRouter);

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
