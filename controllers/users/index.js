const express = require('express')
	, router = express.Router()
	, Auth = require('../../middleware/auth')
	, psApi = require('../../services/powerschoolapi')

router.get('/me', Auth.requireAuthentication, async (req, res) => {
	console.log(req.session.powerschool)
	console.log('another')
	try {
		if (req.session.powerschool && req.session.powerschool.profile.dcid) {
			res.send(req.session.powerschool.profile)
			return
		}
	} catch(error) {
		console.log(error)
	}
	res.status(403).send('error')
	return
})

module.exports = router;
