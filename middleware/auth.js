module.exports = {
	requireAuthentication: (req, res, next) => {
		if (req.session.powerschool && req.session.powerschool.profile) {
			console.log(req.session.powerschool);
			return next();
		} else {
			console.log(req.session.powerschool);
			res.redirect('/auth/testlogin');
		}
	}
}
