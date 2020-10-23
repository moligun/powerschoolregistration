const psApi = require('../services/powerschoolapi')
module.exports = {
	requireAuthentication: (req, res, next) => {
		if (req.session.powerschool && req.session.powerschool.profile) {
			console.log(req.session.powerschool);
			console.log('success');
			return next();
		} else {
			req.session.powerschool = {"profile": {"studentids": [51, 21981]}}
			console.log(req.session.powerschool);
			console.log('redirected');
			//res.redirect('/auth/login');
			return next();
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
