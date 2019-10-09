const express = require('express')
	, router = express.Router()
	, passport = require('passport')
	, powerSchoolAPI = require('../services/powerschoolapi')
	, powerSchoolSSO = require('../services/powerschoolsso');

router.get('/return', (req, res, next) => {
	const identifier = req.query.openid_identifier;
	if (identifier === undefined && 
		req.session.powerschool &&
		req.session.powerschool.state) {
		if (powerSchoolSSO.verifyServerResponse(req) === false) {
			res.status('403').send('Forbidden');
			return;
		} else {
			res.redirect('/students/registration');
			return;
		}
	} else if (identifier) {
		powerSchoolSSO.authWithServer(req, res);
		return;
	}
	res.status('500').send('Cannot process.');
});

// 'logout' route, logout from passport, and destroy the session with AAD.
router.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});

module.exports = router;
