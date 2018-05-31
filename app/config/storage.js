var multer = require('multer');
var path = require('path');
var appDir = path.dirname(require.main.filename);

var helpers = require('../middleware/helpers')

const UPLOAD_PATH = path.join(appDir, 'public/version');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, UPLOAD_PATH)
	},
	filename: function (req, file, cb) {
		var name = "hac_setup_" + helpers.genChars() + ".exe"
		cb(null, name)
	}
})

var upload = multer({
	storage: storage
})

module.exports = upload