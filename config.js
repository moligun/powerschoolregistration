const dotenv = require('dotenv');
dotenv.config();
const hostURL = process.env.HOST_URL;
const tenantID = process.env.GRAPH_TENANT_ID;
const clientID = process.env.GRAPH_CLIENT_ID;
const clientSecret = process.env.GRAPH_CLIENT_SECRET;
const redisPass = process.env.REDIS_PASS;
const powerSchoolURL = 'https://pschool2.lsc.k12.in.us';

exports.passport = {
	state: true,
	clientSecret: clientSecret,
	clientID: clientID,
	callbackURL: hostURL + '/auth/return',
	authorizationURL: 'https://login.microsoftonline.com/' + tenantID + '/oauth2/authorize?prompt=select_account',
	tokenURL: 'https://login.microsoftonline.com/' + tenantID + '/oauth2/v2.0/token',
}

exports.powerSchool = {
	clientID: process.env.PS_CLIENT_ID,
	clientSecret: process.env.PS_CLIENT_SECRET,
	tokenURL: powerSchoolURL + '/oauth/access_token',
	namedQueryURL: powerSchoolURL + '/ws/schema/query/'
}

exports.powerSchoolSSO = {
	URL: powerSchoolURL + '/openid',
	config: {
		'openid.ns': 'http://specs.openid.net/auth/2.0',
		'openid.return_to': hostURL + '/auth/return',
		'openid.mode': 'checkid_setup',
		'openid.ns.ext1': 'http://openid.net/srv/ax/1.0',
		'openid.ext1.mode': 'fetch_request',
		'openid.ext1.type.lastName': 'http://powerschool.com/entity/lastName',
		'openid.ext1.type.dcid': 'http://powerschool.com/entity/id',
		'openid.ext1.type.usertype': 'http://powerschool.com/entity/type',
		'openid.ext1.type.studentids': 'http://powerschool.com/guardian/student-ids',
		'openid.ext1.required': 'dcid,usertype,studentids'
	}
}

exports.azureSqlString = (sqlPassword) => `
	Driver={ODBC Driver 13 for SQL Server};
	Server=tcp:lsc-db.database.windows.net,1433;
	Database=lsc-jhs;Uid=lsc_admin@lsc-db;
	Pwd={${sqlPassword}};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;`;

// The url you need to go to destroy the session with
exports.destroySessionUrl = hostURL + '/.auth/logout';
exports.redisPass = redisPass;
exports.redisURL = 'archivesession.redis.cache.windows.net';
exports.graphURL = 'https://graph.microsoft.com';
