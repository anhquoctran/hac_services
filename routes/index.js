var express = require('express');
var router = express.Router();
var versionController = require('../app/controllers/versionController')
var userController = require('../app/controllers/userController')
var upload = require('../app/config/storage')
var validator = require('validator')
var plateController = require('../app/controllers/plateController')
var authMidd = require('../app/middleware/authentication')
const {
	check,
	validationResult
} = require('express-validator/check')

validator.validator = function (datestr) {
	return !isNaN(Date.parse(datestr))
}

function routes(passport) {
	router.get('/', function (req, res) {
		res.redirect('/surveillance-monitoring')
	});

	router.get('/upload-version', authMidd.isLoggedIn, versionController.uploadVersion)

	router.get('/login', userController.getLogin)

	router.post('/login', [passport.authenticate('local-signin', {
		successRedirect: '/',
		failureRedirect: '/login'
	}), (req, res, next) => {
		if (!req.body.remember_me) {
			return next();
		}

		authMidd.issueToken(req.user, function (err, token) {
			if (err) {
				return next(err);
			}
			res.cookie('remember_me', token, {
				path: '/',
				httpOnly: true,
				maxAge: 604800000
			});
			return next();
		});
	}])

	router.get('/profile/:username', authMidd.isLoggedIn, userController.showProfile)

	router.post('/update-profile', userController.updateProfile);

	router.get('/logout', userController.logout)

	router.post('/upload', [upload.single('vrs'), authMidd.isLoggedIn], versionController.upload)

	router.get('/check-update', versionController.checkUpdate)

	router.get('/dl/:uuid', versionController.download)

	router.get('/archive/older', authMidd.isLoggedIn, versionController.getArchive)

	router.get('/latest', authMidd.isLoggedIn, versionController.latest)

	router.post('/add_image', [
		check('camera_id')
		.exists()
		.trim()
		.isNumeric()
		.withMessage('cannot be null and must be numeric type'),

		check('frametime')
		.exists()
		.trim()
		.withMessage('cannot be null and must be date time type'),
		check('location')
		.exists()
		.trim()
		.withMessage('cannot be null'),

		check('vehicle_plate')
		.exists()
		.trim()
		.withMessage('cannot be null'),

		check('encoded_plate_image')
		.exists()
		.trim()
		.isBase64()
		.withMessage('cannot be null and must be a base64 string'),
		check('encoded_vehicle_image')
		.exists()
		.trim()
		.isBase64()
		.withMessage('cannot be null and must be a base64 string')
	], plateController.addImage)

	router.get('/surveillance-monitoring', authMidd.isLoggedIn, plateController.monitor)

	router.get('/get-plates-list', authMidd.isLoggedIn, plateController.getPlatesIndex)

	router.post('/plates/filter', [
		authMidd.isLoggedIn,
		check('dateFrom')
		.exists()
		.trim()
		.withMessage('cannot be null and must be date time type'),
		check('dateTo')
		.exists()
		.trim()
		.withMessage('cannot be null and must be date time type')
	], plateController.filter)
}

module.exports.routes = routes;
module.exports.router = router;