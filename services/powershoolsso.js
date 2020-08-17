const config = require('../config');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const authWithServer = (req, res) => {
	const identifier = req.query.openid_identifier;
	let rpRequestParams = config.powerSchoolSSO.config;

	let state;
	let returnToParams = new URLSearchParams(rpRequestParams['openid.return_to'].split('?').pop());
	if (returnToParams['state'] === undefined) {
		state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		rpRequestParams['openid.return_to'] = rpRequestParams['openid.return_to'].split('?').shift() + '?state=' + state;
	} else {
		state = returnToParams['state'];
	}
	req.session.powerschool = { state };
	rpRequestParams['openid.claimed_id'] = identifier;
	rpRequestParams['openid.identity'] = identifier;

	const params = new URLSearchParams(rpRequestParams);
	res.redirect(config.powerSchoolSSO.URL + '?' + params.toString());
}

const verifyServerResponse = (req) => {
	if (verifyReturnUrl(req) === false) {
		console.log('return URL not verified');
		return false;
	}

	if (verifySameState(req) === false) {
		console.log('State mismatch');
		return false;
	}

	const fields = verifyFields(req);
	if (fields === false) {
		console.log('Proper Fields Not Returned');
		return false;
	} else {
		req.session.powerschool['profile'] = fields
		return fields;
	}
}

const verifyReturnUrl = (req) => {
	let urlString = req.protocol + '://' + req.get('host');
	if (req.query['openid.return_to'] === undefined) {
		return false;
	}
	let queryUrl = req.query['openid.return_to'].split('?').shift();
	urlString += req.baseUrl;
	urlString += req.path;
	if (urlString === queryUrl) {
		return true;
	}
	console.log('Issue verifying return URL');
	return false;
}

const verifySameState = (req) => {
	let sameState = req.query.state === req.session.powerschool['state'];
	delete req.session.powerschool['state'];
	if (sameState === true) {
		return true;
	}
	return false;
}

const verifyFields = (req) => {
	const requiredFields = [
		'openid.ext1.value.dcid',
		'openid.ext1.value.lastName',
		'openid.ext1.value.usertype',
		'openid.ext1.value.studentids'
	];
	let fieldsObj = {};

	const allFieldsPresent = requiredFields.every(function(field) {
		if (req.query[field] == undefined || req.query[field] == '') {
			return false;
		}
		let newFieldName = field.split('.').pop();
		if (newFieldName === 'studentids') {
			const studentIds = JSON.parse(req.query[field]);
			fieldsObj[newFieldName] = JSON.parse(studentIds['id']);
		} else {
			fieldsObj[newFieldName] = req.query[field];
		}
		return true;
	});
	if (allFieldsPresent === true) {
		return fieldsObj;
	} else {
		return false;
	}
}

module.exports = {
	authWithServer: authWithServer,
	verifyServerResponse: verifyServerResponse
}