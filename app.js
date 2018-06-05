var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport')
var logger = require('morgan');
var cors = require('cors');
var pug = require('pug');
var flash = require('connect-flash')
var db = require('./database');
var sequelize = require('sequelize')
var session = require('express-session')
var user = require('./app/models/usertbl')(db, sequelize)
var cleanupJob = require('./app/jobs/cleanupJob')
var bodyparser = require('body-parser')
global.dd = require('dump-die')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views/'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyparser.urlencoded({
	extended: false,
	limit: '100mb',
	parameterLimit: 1000000
}));

app.use(bodyparser.json({
	limit: '100mb',
	parameterLimit: 1000000
}))

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public/')));
app.use(cors());

app.use(session({
	secret: '@hueicCat2018',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(passport.authenticate('remember-me'));
app.use(flash())

var indexRouter = require('./routes').router;

app.use('/', indexRouter);

require('./app/config/auth')(passport, user)

require('./routes/index').routes(passport)

app.use(function (req, res, next) {
	res.status(404);

	// respond with html page
	if (req.accepts('html')) {
		res.render('errors/error', {
			message: "Trang không tồn tại",
			code: 404
		});
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.send({
			error: 'Page Not found'
		});
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Error: Page Not found');
});

app.use(function (req, res, next) {
	res.status(500);

	// respond with html page
	if (req.accepts('html')) {
		res.render('errors/error', {
			message: "Lỗi truy vấn máy chủ",
			code: 500
		});
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.send({
			error: 'Internal Server Error'
		});
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Error: Internal Server Error');
});

db.authenticate().then(() => {
		console.log('Database connection has been established successfully');
	})
	.catch((err) => {
		console.log('Unable to connect to database...', err);
	});

cleanupJob.start();

//require('./app/middleware/helpers').getNetworkIPAddress();

module.exports = app;