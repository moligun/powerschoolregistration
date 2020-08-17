const express = require('express')
	, auth = require('../../middleware/auth')
	, router = express.Router()
	, psApi = require('../../services/powerschoolapi')
router.get('/', async (req, res) => {
	try {
		/*
		if (req.session.powerschool.profile && req.session.powerschool.profile.studentids) {
			const accessToken = await psApi.getAccessToken();
			const studentPromises = psApi.getStudents(accessToken.access_token, req.session.powerschool.profile.studentids)
			if (studentPromises !== false) {
				const students = await studentPromises
				console.log(students)
				res.send(students)
				return
			}
		}
		*/
			const accessToken = await psApi.getAccessToken();
			const contactPromises = psApi.getContacts(accessToken.access_token, [51])
			if (contactPromises !== false) {
				const contacts = await contactPromises
				res.send(contacts)
				return
			}
	} catch(error) {
		console.log(error)
	}	
	res.send([])
})
module.exports = router