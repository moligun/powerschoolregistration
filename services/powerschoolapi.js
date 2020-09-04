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
			.then(response => response.json())
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
			let query = `v1/student/${id}?expansions=phones,addresses,demographics&extensions=u_health,s_in_stu_x`
			studentPromises.push(createQuery(token, query, {method: 'GET'}))
		});
		return Promise.all(studentPromises)
	}
	return false;
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

module.exports = {
	getAccessToken,
	getStudents,
	deleteContactAssociation,
	getContacts
}