const config = require('../config');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const getAccessToken = async () => {
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
	const response = fetch(url, {
		headers: headers,
		body: params,
		method: 'POST'
	}).then((response) => {
		return response.json()
	})
	return response;
}
const runNamedQuery = (token, namedQuery, paramsObj) => {
	try {
		if (token) {
			const headers = {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
			const url = config.powerSchool.namedQueryURL + namedQuery + '?pagesize=500';
			return fetch(url, {
				headers: headers,
				body: JSON.stringify(paramsObj),
				method: 'POST'
			}).then((responseData) => {
				return responseData.json()
			})
		}
	} catch (error) {
		console.log(error);
	}
	return false;
}
const getStudentInfo = (token, params) => {
	const namedQuery = 'com.lsc.ljhs.get_student_by_studentnumber';
	const profileResults = runNamedQuery(token, namedQuery, params);
	return profileResults;
}

module.exports = {
	getAccessToken,
	getStudentInfo,
}