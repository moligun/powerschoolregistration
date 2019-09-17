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
const runNamedQuery = async (token, namedQuery, paramsObj) => {
	try {
		if (token) {
			const headers = {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
			const url = config.powerSchool.namedQueryURL + namedQuery + '?pagesize=500';
			const response = await fetch(url, {
				headers: headers,
				body: JSON.stringify(paramsObj),
				method: 'POST'
			});
			const jsonResponse = await response.json();
			return jsonResponse;
		}
	} catch (error) {
		console.log(error);
	}
	return false;
}
const getStaffInfo = async (token, params) => {
	const namedQuery = 'com.lsc.roster.get_staff_info';
	const profileResults = await runNamedQuery(token, namedQuery, params);
	return profileResults;
}

const getActiveTerm = async (token, params) => {
	const namedQuery = 'com.lsc.roster.get_current_term';
	const termResult = await runNamedQuery(token, namedQuery, params);
	return termResult;
}

const getClassRoster = async (token, params) => {
	const namedQuery = 'com.lsc.roster.get_class_roster';
	const termResult = await runNamedQuery(token, namedQuery, params);
	return termResult;
}

const getSchoolsList = async (token, params) => {
	const namedQuery = 'com.lsc.roster.get_schools_list';
	const termResult = await runNamedQuery(token, namedQuery, params);
	return termResult;
}

const getStaffList = async (token, params) => {
	const namedQuery = 'com.lsc.roster.get_staff_list';
	const termResult = await runNamedQuery(token, namedQuery, params);
	return termResult;
}
module.exports = {
	getAccessToken: getAccessToken,
	getStaffInfo: getStaffInfo,
	getActiveTerm: getActiveTerm,
	getClassRoster: getClassRoster,
	getSchoolsList: getSchoolsList,
	getStaffList: getStaffList
}