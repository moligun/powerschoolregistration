const AzureSql = require('./azuresql')
class Tickets extends AzureSql {
	constructor() {
		super()
		this.table = 'TACTickets'
	}
}

module.exports = new Tickets()