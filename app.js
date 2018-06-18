var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('express-flash'); // for message

// router
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// plugins in node modules
app.use('/js', express.static(__dirname + '/node_modules/jquery-validation/dist'));

//Set up mongoose connection
mongoose.Promise = global.Promise; // use promise
mongoose.connect('mongodb://127.0.0.1/ejsBlank'); // driverName://dbIP/dbName
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// session : before routing
app.use(session({
    secret: 'ExpressEJSBlank@@', // any string for Security
    resave: false,
    saveUninitialized: true
}));
app.use(flash()); // after cookie, session

// Set session // after session
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

// routes
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// client error for ajax
app.use(function(err, req, res, next) {
  if (req.xhr) {
    res.status(err.status || 500).send(err.message);
  } else {
    next(err);
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error' + ( (err.status == 404)?'-404':'' ) );
});

module.exports = app;
