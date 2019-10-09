module.exports = {
	requireAuthentication: (req, res, next) => {
		if (req.session.powerschool && req.session.powerschool.profile) {
			return next();
		} else {
			console.log(req.session.powerschool);
			res.redirect('/auth/return');
		}
	}
}
