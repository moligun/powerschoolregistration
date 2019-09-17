const config = require('../config');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const getMemberProfile = async (token) => {
	try {
		if (token) {
			const headers = {
				'Authorization': 'Bearer ' + token
			}	
			const url = config.graphURL + '/v1.0/me';
			const response = await fetch(url, {headers: headers});
			const jsonData = await response.json();
			return jsonData;
		}
	} catch (error) {
		console.log(error);
	}
	return false;
}

module.exports = {
	getMemberProfile: getMemberProfile
}
