module.exports = {
	requireAuthentication: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		} else {
			const url = req.originalUrl;
			req.session.originalUrl = url !== undefined ? url : '/';
			res.redirect('/auth/login');
		}
	},
	requirePsAdmin: (req, res, next) => {
		if (req.user.psAdmin === true) {
			return next();
		} else {
			res.send('error');
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
