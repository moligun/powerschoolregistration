const express = require('express')
	, powerSchoolApi = require('../../services/powerschoolapi')
	, azureQueue = require('../../services/azurequeue')
	, dateFormat = require('dateformat')
	, auth = require('../../middleware/auth')
	, router = express.Router();
router.use(auth.requireAuthentication);
router.get('/', (req, res) => {
		res.render('students/registration', { user: req.session.powerschool.profile });
	}
);
module.exports = router;
