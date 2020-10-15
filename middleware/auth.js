const psApi = require('../services/powerschoolapi')
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
	},
	getAccessToken: async (req, res, next) => {
		req.session.powerschool = {"profile": {"studentids": [51, 21981]}}
		if (req.session.token) {
			return next()
		}
		const token = await psApi.getAccessToken()
		req.session.token = token
		return next()
	}
}
