module.exports = {
	requireAuthentication: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.session.originalUrl = '/';
			res.redirect('/auth/login');
		}
	},
	requireAdmin: (req, res, next) => {
		if (req.user.access_level === 2) {
			return next();
		} else {
			res.status(403).send('Not permitted access');
		}
	},
	applyUserGlobals: (req, res, next) => {
		let impersonateActive = req.session.impersonated_staff !== undefined;
		res.locals.user = req.user;
		if (impersonateActive) {
			res.locals.staffInfo = req.session.impersonated_staff;
			res.locals.impersonated_staff = req.session.impersonated_staff;
		} else {
			res.locals.staffInfo = req.user !== undefined ? req.user.staffInfo : undefined;
			res.locals.impersonated_staff = undefined;
		}
		return next();
	}
}
