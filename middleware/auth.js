const psApi = require('../services/powerschoolapi')
module.exports = {
	requireAuthentication: (req, res, next) => {
		if (req.session.powerschool && req.session.powerschool.profile) {
			return next();
		} else {
			req.session.powerschool = {"profile": {"dcid": 1072550, "studentids": [51, 21981, 94519]}}
			return next();
			console.log('redirected');
			res.redirect('/auth/login');
			return;
		}
	},
	getAccessToken: async (req, res, next) => {
		if (req.session.token) {
			return next()
		}
		const token = await psApi.getAccessToken()
		req.session.token = token
		return next()
	}
}
