const config = require('../config');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const getAccessToken = async () => {
	try {
		const encodedAuthCode = Buffer.from(config.powerSchool.clientID + 
			':' + config.powerSchool.clientSecret).toString('base64');
		const headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + encodedAuthCode
		}
		const formValues = {
			'grant_type': 'client_credentials'
		}
		const params = new URLSearchParams(formValues);
		const url = config.powerSchool.tokenURL;
		const response = await fetch(url, {
			headers: headers,
			body: params,
			method: 'POST'
		});
		const jsonResponse = await response.json();
		return jsonResponse;
	} catch (error) {
		console.log(error);
	}
}
const createQuery = (token, query, paramsObj) => {
	try {
		if (token) {
			const headers = {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
			const url = config.powerSchool.namedQueryURL + query
			const { body, method } = paramsObj
			return fetch(url, {
				headers: headers,
				body: body !== undefined ? JSON.stringify(body) : null,
				method: method !== undefined ? method : 'GET'
			})
			.then((response) => response.json())
		}
	} catch (error) {
		console.log(error)
	}
	return false
}

const getStudents = (token, studentIds) => {
	let studentPromises = [];
	if (studentIds && studentIds.length > 0) {
		studentIds.forEach(id => {
			let query = `v1/student/${id}?expansions=phones,addresses,demographics,school_enrollment&extensions=u_health,s_in_stu_x,u_demo,u_release`
			studentPromises.push(createQuery(token, query, {method: 'GET'}))
		});
		return Promise.all(studentPromises)
	}
	return false;
}

const updateStudent = (token, body) => {
	if (body) {
		let query = `v1/student/`
		return createQuery(token, query, {method: 'POST', body})
	}
	return false;
}

const getDistricts = (token) => {
	let query = 'schema/table/gen?projection=cat,name,value&q=cat==districts&sort=name'
	return createQuery(token, query, {method: 'GET'})
}

const getContact = (token, contactId) => {
	let query = `contacts/contact/${contactId}`
	return createQuery(token, query, {method: 'GET'})
}

const getContacts = (token, studentIds) => {
	let contactPromises = [];
	if (studentIds && studentIds.length > 0) {
		studentIds.forEach(id => {
			let query = `contacts/student/${id}`
			contactPromises.push(createQuery(token, query, {method: 'GET'}))
		});
		return Promise.all(contactPromises)
			.then((dataSets) => {
				let contactsCollection = []
				for (let studentContacts of dataSets) {
					for (let contact of studentContacts) {
						contactsCollection.push(contact)
					}
				}
				return contactsCollection
			})
	}
	return false
}

const deleteContactAssociation = (token, contactId, contactStudentId) => {
	if (contactId && contactStudentId > 0) {
		const query = `contacts/${contactId}/students/${contactStudentId}`
		return createQuery(token, query, {method: 'DELETE'})
	}
	return false
}

const deleteContactPhone = (token, contactId, contactPhoneId) => {
	if (contactId && contactPhoneId > 0) {
		const query = `contacts/${contactId}/phones/${contactPhoneId}`
		return createQuery(token, query, {method: 'DELETE'})
	}
	return false
}

const addContactPhone = (token, contactId, body) => {
	if (contactId && body) {
		const query = `contacts/${contactId}/phones`
		return createQuery(token, query, {method: 'POST', body})
	}
	return false
}

const updateContactPhone = (token, contactId, contactPhoneId, body) => {
	if (contactId && contactPhoneId && body) {
		const query = `contacts/${contactId}/phones/${contactPhoneId}`
		console.log(query)
		return createQuery(token, query, {method: 'PUT', body})
	}
	return false
}

const updateContactDemographics = (token, contactId, body) => {
	if (contactId && body) {
		const query = `contacts/${contactId}/demographics`
		return createQuery(token, query, {method: 'PUT', body})
	}
	return false
}

const addContact = (token, body) => {
	if (body) {
		let query = `contacts/contact`
		return createQuery(token, query, {method: 'POST', body})
	}
	return false;
}

const addContactStudent = (token, contactId, body) => {
	if (contactId && body) {
		const query = `contacts/${contactId}/students`
		return createQuery(token, query, {method: 'POST', body})
	}
	return false
}

const updateContactStudent = (token, contactId, contactStudentId, body) => {
	if (contactId && contactStudentId && body) {
		const query = `contacts/${contactId}/students/${contactStudentId}`
		return createQuery(token, query, {method: 'PUT', body})
	}
	return false
}

const updateContactStudentDetail = (
	token, contactId, 
	contactStudentId, contactStudentDetailId, body) => {
	if (contactId && contactStudentId && contactStudentDetailId && body) {
		const query = `contacts/${contactId}/students/${contactStudentId}/studentdetails/${contactStudentDetailId}`
		return createQuery(token, query, {method: 'PUT', body})
	}
	return false
}

module.exports = {
	getAccessToken,
	getStudents,
	getDistricts,
	deleteContactAssociation,
	getContact,
	getContacts,
	addContact,
	updateContactDemographics,
	addContactPhone,
	updateContactPhone,
	deleteContactPhone,
	addContactStudent,
	updateContactStudent,
	updateContactStudentDetail,
	updateStudent
}