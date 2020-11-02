const express = require('express')
	, auth = require('../../middleware/auth')
	, router = express.Router()
	, psApi = require('../../services/powerschoolapi')
	, fetch = require('node-fetch')
router.get('/', auth.requireAuthentication, auth.getAccessToken, async (req, res) => {
	try {
		if (req.session.powerschool.profile && req.session.powerschool.profile.studentids) {
			const accessToken = req.session.token.access_token
			const contactPromises = psApi.getContacts(accessToken, req.session.powerschool.profile.studentids)
			if (contactPromises !== false) {
				const contacts = await contactPromises
				res.send(contacts)
				return
			}
		}
	} catch(error) {
		console.log(error)
	}	
	res.send([])
})

router.get('/contact/:id', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	if (contactId) {
		try {
			const accessToken = req.session.token.access_token
			const contactPromise = psApi.getContact(accessToken, contactId)
			if (contactPromise !== false) {
				const contact = await contactPromise
				if (contact) {
					res.send(contact)
					return
				}
			}
		} catch(error) {
			console.log(error)
		}	
	}
	res.send({})
})

router.post('/', auth.getAccessToken, async (req, res) => {
	const data = req.body
	if (data) {
		const accessToken = req.session.token.access_token
		const contactPromise = psApi.addContact(accessToken, data)
		const result = await psApi.processPromise(contactPromise)
		if (result !== false) {
			res.send(result)
			return
		}
	}
	const errorMessage = {"error_message": {"error": ["Issues occurred while attempting to add new contact"]}}
	res.send(errorMessage)
	return
})

router.post('/:id/students', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const data = req.body
	if (contactId && data) {
		const accessToken = req.session.token.access_token
		const contactPromise = psApi.addContactStudent(accessToken, contactId, data)
		const result = await psApi.processPromise(contactPromise)
		if (result !== false) {
			res.send(result)
			return
		}
	}
	const errorMessage = {"error_message": {"error": ["Issues occurred while attempting to add contact to student."]}}
	res.send(errorMessage)
	return
})

router.put('/:id/demographics/', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const data = req.body
	if (contactId && data) {
		const accessToken = req.session.token.access_token
		const contactPromise = psApi.updateContactDemographics(accessToken, contactId, data)
		const result = await psApi.processPromise(contactPromise)
		if (result !== false) {
			res.send(result)
			return
		}
	}
	const errorMessage = {"error_message": {"error": ["Issues occurred while attempting to update contact name"]}}
	res.send(errorMessage)
	return
})

router.put('/:id/students/:contactStudentId', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const contactStudentId = req.params.contactStudentId
	const data = req.body
	const accessToken = req.session.token.access_token
	if (accessToken && contactId && contactStudentId && data) {
		const contactPromise = psApi.updateContactStudent(accessToken, contactId, contactStudentId, data)
		const result = await psApi.processPromise(contactPromise)
		if (result !== false) {
			res.send(result)
			return
		}
	}
	const errorMessage = {"error_message": {"error": ["Issues occurred while attempting to update contact order"]}}
	res.send(errorMessage)
	return
})

router.put('/:id/students/:contactStudentId/studentdetails/:contactStudentDetailId', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const contactStudentId = req.params.contactStudentId
	const contactStudentDetailId = req.params.contactStudentDetailId
	const data = req.body
	if (contactId && contactStudentId && contactStudentDetailId && data) {
		const accessToken = req.session.token.access_token
		const contactPromise = psApi.updateContactStudentDetail(
			accessToken, 
			contactId, 
			contactStudentId, 
			contactStudentDetailId, 
			data
		)
		const result = await psApi.processPromise(contactPromise)
		if (result !== false) {
			res.send(result)
			return
		}
	}
	const errorMessage = {"error_message": {"error": ["Issues occurred while attempting to update Contact Student Details"]}}
	res.send(errorMessage)
	return
})

router.delete('/:id/students/:contactstudentid', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const contactStudentId = req.params.contactstudentid
	if (contactId && contactStudentId) {
		const accessToken = req.session.token.access_token
		const contactPromise = psApi.deleteContactAssociation(accessToken, contactId, contactStudentId)
		const result = await psApi.processPromise(contactPromise)
		if (result !== false) {
			res.send(result)
			return
		}
	}
	const errorMessage = {"error_message": {"error": ["Could not remove contact from student."]}}
	res.send(errorMessage)
	return
})

router.post('/:id/phones', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const data = req.body
	if (contactId && data) {
		const accessToken = req.session.token.access_token
		const contactPromise = psApi.addContactPhone(accessToken, contactId, data)
		const result = await psApi.processPromise(contactPromise)
		if (result !== false) {
			res.send(result)
			return
		}
	}
	const errorMessage = {"error_message": {"error": ["Could not add phone number to contact."]}}
	res.send(errorMessage)
	return
})

router.put('/:id/phones/:contactPhoneId', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const contactPhoneId = req.params.contactPhoneId
	const data = req.body
	if (contactId && contactPhoneId && data) {
		const accessToken = req.session.token.access_token
		const contactPromise = psApi.updateContactPhone(accessToken, contactId, contactPhoneId, data)
		const result = await psApi.processPromise(contactPromise)
		if (result !== false) {
			res.send(result)
			return
		}
	}
	const errorMessage = {"error_message": {"error": ["Could not edit contact phone number."]}}
	res.send(errorMessage)
	return
})

router.post('/:id/emails', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const data = req.body
	if (contactId && data) {
		const accessToken = req.session.token.access_token
		const contactPromise = psApi.addContactEmail(accessToken, contactId, data)
		const result = await psApi.processPromise(contactPromise)
		if (result !== false) {
			res.send(result)
			return
		}
	}
	const errorMessage = {"error_message": {"error": ["Could not add email to contact."]}}
	res.send(errorMessage)
	return
})

router.put('/:id/emails/:contactEmailId', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const contactEmailId = req.params.contactEmailId
	const data = req.body
	if (contactId && contactEmailId && data) {
		const accessToken = req.session.token.access_token
		const contactPromise = psApi.updateContactEmail(accessToken, contactId, contactEmailId, data)
		const result = await psApi.processPromise(contactPromise)
		if (result !== false) {
			res.send(result)
			return
		}
	}
	const errorMessage = {"error_message": {"error": ["Could not edit contact email."]}}
	res.send(errorMessage)
	return
})

router.delete('/:id/phones/:contactPhoneId', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const contactPhoneId = req.params.contactPhoneId
	if (contactId && contactPhoneId) {
		try {
			const accessToken = req.session.token.access_token
			const deleteAssoc = await psApi.deleteContactPhone(accessToken, contactId, contactPhoneId)
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