// additional packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var multer = require('multer');
var mongoose = require('mongoose');

// project parts
var index = require('./routes/index');
var users = require('./routes/users');
var image = require('./routes/image');
var album = require('./routes/album');

// express setup
var app = express();

// setup mongoose connection
var mongoDB = 'mongodb://127.0.0.1:27017';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console,'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'react-client/build')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/react-client/build/index.html')
});
app.use('/users', users);
app.use('/image', image);
app.use('/album', album);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
