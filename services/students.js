const AzureSql = require('./azuresql')
	, PSApi = require('../services/powerschoolapi')
class Students extends AzureSql {
	constructor() {
		super()
		this.table = 'TACTicket_Students'
	}

	getPSStudentInfo(obj) {
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
					return studentData
				}
			})
	}

	findOrCreate(obj) {
		return this
			.find(obj).then((data) => {
				if (data && data.id) {
					const today = new Date()
					const modified = new Date(data.modified)
					const dayInSeconds = 86400
					const weekInSeconds = dayInSeconds * 7
					const dateDiffInSeconds = (today - modified) / 1000
					if (dateDiffInSeconds >= weekInSeconds) {
						return this.getPSStudentInfo(obj)
							.then((data) => {
								data.modified = today.toISOString()
								return this.save(data, obj)
							})
					}
					return data
				} else {
					return this.getPSStudentInfo(obj)
						.then((data) => {
							return this.create(data)
						})
						.catch((error) => {
							console.log(error)
						})
				}
			})
	}
}

module.exports = new Students()