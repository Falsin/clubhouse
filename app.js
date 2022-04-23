var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const mongoDB = 'mongodb+srv://m001-student:m001-mongodb-basics@sandbox.jnrzi.mongodb.net/clubhouse?retryWrites=true&w=majority';
const connection = mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalog = require('./routes/catalog');

var app = express();

//const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

app.use(session({
  secret : 'secret',
  saveUninitialized : false,
  resave : false,
  store: MongoStore.create({
    mongoUrl: mongoDB,
    collectionName: 'sessions'
  })
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', catalog)
app.use('/', indexRouter);
app.use('/users', usersRouter);

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