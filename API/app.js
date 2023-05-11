var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var articlesRouter = require('./routes/articles');
var channelRouter = require('./routes/channel');
var postsRouter = require('./routes/posts');
var profileRouter = require('./routes/profile');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/articles', articlesRouter);
app.use('/channel', channelRouter);
app.use('/posts', postsRouter);
app.use('/profile', profileRouter);

const allowedOrigins = ['http://localhost:19006/', 'http://localhost:3000', 'http://ec2-3-134-100-155.us-east-2.compute.amazonaws.com', 'https://smtp.zoho.com']

app.use(cors());

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

//Basic Listening
app.listen(3000, () => {
  console.log("Server running on port 3000");
 });

module.exports = app;

