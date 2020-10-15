const express = require('express')
	, auth = require('../../middleware/auth')
	, router = express.Router()
	, psApi = require('../../services/powerschoolapi')
	, fetch = require('node-fetch')
router.get('/', auth.getAccessToken, async (req, res) => {
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
		try {
			const accessToken = req.session.token.access_token
			const addContact = await psApi.addContact(accessToken, data)
			console.log(addContact)
			res.send(addContact)
			return
		 } catch(error) {
			console.log(error)
			res.send(error)
			return
		 }
	}
	res.send('Valid Contact ID/ Association ID must be provided')
})

router.post('/:id/students', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const data = req.body
	if (contactId && data) {
		try {
			const accessToken = req.session.token.access_token
			const addStudent = await psApi.addContactStudent(accessToken, contactId, data)
			res.send(addStudent)
			return
		 } catch(error) {
			console.log(error)
			res.send(error)
			return
		 }
	}
	res.send('Valid Contact ID/ Association ID must be provided')
})

router.put('/:id/demographics/', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const data = req.body
	try {
		if (contactId && data) {
			const accessToken = req.session.token.access_token
			const updateContact = await psApi.updateContactDemographics(accessToken, contactId, data)
			res.send(updateContact)
			return
		}
	} catch(error) {
		console.log(error)
		res.send(error)
		return
	}
	res.send('Valid Contact ID/ Association ID must be provided')
})

router.put('/:id/students/:contactStudentId', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const contactStudentId = req.params.contactStudentId
	const data = req.body
	let success = false
	let attempts = 0
	while (success === false && attempts < 5) {
		try {
			if (contactId && contactStudentId && data) {
				const accessToken = req.session.token.access_token
				const updateContact = await psApi.updateContactStudent(accessToken, contactId, contactStudentId, data)
				success = true
				res.send(updateContact)
				return
			}
		} catch(error) {
			console.log(error)
			attempts++
		}
	}
	console.log('Failed Out')
	res.send('Valid Contact ID/ Association ID must be provided')
})

router.put('/:id/students/:contactStudentId/studentdetails/:contactStudentDetailId', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const contactStudentId = req.params.contactStudentId
	const contactStudentDetailId = req.params.contactStudentDetailId
	const data = req.body
	try {
		if (contactId && contactStudentId && contactStudentDetailId && data) {
			const accessToken = req.session.token.access_token
			const updateContactDetail = await psApi.updateContactStudentDetail(
				accessToken, 
				contactId, 
				contactStudentId, 
				contactStudentDetailId, 
				data
			)
			res.send(updateContactDetail)
			return
		}
	} catch(error) {
		console.log(error)
		res.send(error)
		return
	}
	res.send('Valid Contact ID/ Association ID must be provided')
})

router.delete('/:id/students/:contactstudentid', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const contactStudentId = req.params.contactstudentid
	if (contactId && contactStudentId) {
		try {
			const accessToken = req.session.token.access_token
			const deleteAssoc = await psApi.deleteContactAssociation(accessToken, contactId, contactStudentId)
			console.log(deleteAssoc)
			res.send(deleteAssoc)
			return
		 } catch(error) {
			res.send(error)
			return
		 }
	}
	res.send('Valid Contact ID/ Association ID must be provided')
})

router.post('/:id/phones', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const data = req.body
	if (contactId && data) {
		try {
			const accessToken = req.session.token.access_token
			const addContact = await psApi.addContactPhone(accessToken, contactId, data)
			console.log(addContact)
			res.send(addContact)
			return
		 } catch(error) {
			console.log(error)
			res.send(error)
			return
		 }
	}
	res.send('Valid Contact ID/ Association ID must be provided')
})

router.put('/:id/phones/:contactPhoneId', auth.getAccessToken, async (req, res) => {
	const contactId = req.params.id
	const contactPhoneId = req.params.contactPhoneId
	const data = req.body
	console.log(data)
	try {
		if (contactId && contactPhoneId && data) {
			const accessToken = req.session.token.access_token
			const updateContact = await psApi.updateContactPhone(accessToken, contactId, contactPhoneId, data)
			console.log(JSON.stringify(updateContact.error_message))
			res.send(updateContact)
			return
		}
	} catch(error) {
		console.log(error)
		res.send(error)
		return
	}
	res.send('Valid Contact ID/ Association ID must be provided')
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