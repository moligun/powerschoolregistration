const express = require('express')
	, router = express.Router()
	, config = require('../config')
	, { URLSearchParams } = require('url')
	, loginApi = require('../services/loginapi')
	, passport = require('passport');

router.get('/login', passport.authenticate('oauth2', {successRedirect: '/'}), (req, res) => {
	res.send('logged in');
});

router.get('/return', passport.authenticate('oauth2', {successRedirect:'/'}), (req, res) => {
	let redirectUrl = '/';
	console.log(redirectUrl)
	res.redirect(redirectUrl);
});

// 'logout' route, logout from passport, and destroy the session with AAD.
router.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});

module.exports = router;
