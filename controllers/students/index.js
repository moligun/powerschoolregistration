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
			const studentPromises = psApi.getStudents(accessToken.access_token, [51])
			if (studentPromises !== false) {
				const students = await studentPromises
				console.log(students[0].student)
				console.log(students[0].student['_extension_data']['_table_extension'][1])
				res.send(students)
				return
			}
	} catch(error) {
		console.log(error)
	}	
	res.send([])
})
module.exports = router