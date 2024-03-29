require('dotenv').config();

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const http = require('http');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var visitorsRouter = require('./routes/visitors');
var queueRouter = require('./routes/queue');
var piutangRouter = require('./routes/piutang');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// app.listen(port, () => {
//   console.log(`Server running at port:${port}/`);
// });

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/visitors', visitorsRouter);
app.use('/queue', queueRouter);
app.use('/piutang', piutangRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;