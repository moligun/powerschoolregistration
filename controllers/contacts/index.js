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

router.delete('/contact/:id/student/:contactstudentid', async (req, res) => {
	const contactId = req.params.id
	const contactStudentId = req.params.contactstudentid
	if (contactId && contactStudentId) {
		try {
			const accessToken = await psApi.getAccessToken();
			console.log(accessToken)
			const deleteAssoc = await psApi.deleteContactAssociation(accessToken.access_token, contactId, contactStudentId)
			res.send(deleteAssoc)
			return
		 } catch(error) {
			res.send(error)
			return
		 }
	}
	res.send('Valid Contact ID/ Association ID must be provided')
})
module.exports = router