var express = require('express');
var hbs = require('hbs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({
	dest: './uploads'
});
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var mongoDB = require('mongodb');
var mongoose = require('mongoose');
var getFormData = require('get-form-data');
var async = require('async');
var db = mongoose.connection;


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use((req, res, next) => {
	res.locals.messages = require('express-messages')(req, res);
	next();
});
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
	secret: 'secretKey',
	resave: true,
	saveUninitialized: true,
}));

var sess;
// app.get('/', function(req, res){
// 	sess = req.session;
// 	sess.username;
// })

app.get("*", function (req, res, next) {
	res.locals.user = req.user || null;
	next();
});


app.use('/', index);
app.use('/users', users);

app.post('/book-uploaded')

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
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

hbs.registerHelper('json', function (context) {
	return JSON.stringify(context);
});

module.exports = app;
