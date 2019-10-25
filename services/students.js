const AzureSql = require('./azuresql')
	, PSApi = require('../services/powerschoolapi')
class Students extends AzureSql {
	constructor() {
		super()
		this.table = 'TACTicket_Students'
	}

	findOrCreate(obj) {
		return this
			.find(obj).then((data) => {
				if (data && data.id) {
					return data
				} else {
					return PSApi.getAccessToken()
						.then((token) => {
							if (token.access_token) {
								return PSApi.getStudentInfo(token.access_token, obj)
							}
						})
						.then((data) => {
							if (data && data.record) {
								let studentData = data.record.shift();
								if (studentData['_name']) {
									delete studentData['_name'];
								}
								return this.create(studentData);
							}
						})
					
				}
			})
	}
}

module.exports = new Students()