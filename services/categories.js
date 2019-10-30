const AzureSql = require('./azuresql')
class Categories extends AzureSql {
	constructor() {
		super()
		this.table = 'TACTicket_Categories'
	}
}

module.exports = new Categories()