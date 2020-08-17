const express = require('express')
	, router = express.Router()
	, powerSchoolSSO = require('../services/powershoolsso');

router.get('/login', (req, res, next) => {
	const identifier = req.query.openid_identifier;
	if (identifier === undefined && 
		req.session.powerschool &&
		req.session.powerschool.state) {
		if (powerSchoolSSO.verifyServerResponse(req) === false) {
			res.status('403').send('Forbidden');
			return;
		} else {
			res.redirect('/');
			return;
		}
	} else if (identifier) {
		powerSchoolSSO.authWithServer(req, res);
		return;
	}
	res.send('Cannot process.');
	return;
});

router.get('/return', (req, res) => {
	let redirectUrl = req.session.originalUrl ? req.session.originalUrl : '/';
	res.redirect(redirectUrl);
});

// 'logout' route, logout from passport, and destroy the session with AAD.
router.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});

module.exports = router;
