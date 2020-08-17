module.exports = {
	requireAuthentication: (req, res, next) => {
		if (req.session.powerschool && req.session.powerschool.profile) {
			console.log(req.session.powerschool);
			console.log('success');
			return next();
		} else {
			console.log(req.session.powerschool);
			console.log('redirected');
			res.redirect('/auth/login');
			return;
		}
	}
}
