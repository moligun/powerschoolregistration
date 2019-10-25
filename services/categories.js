const AzureSql = require('./azuresql')
class Categories extends AzureSql {
	constructor() {
		super()
		this.table = 'TACTicket_Categories'
	}

	all(filters) {
		return super.all(filters, 1000, 1, false)
	}
}

module.exports = new Categories()