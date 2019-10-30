const AzureSql = require('./azuresql')
class TicketComments extends AzureSql {
	constructor() {
		super()
		this.table = 'TACTicket_Comments'
	}

	applySelect(item) {
		return item
			.select('TACTicket_Comments.*', 'U.lastfirst AS author')
	}

	applyJoins(item) {
		item
			.leftOuterJoin('TACTicket_Users AS U', this.table + '.created_by', 'U.id')
		return item
	}

	applyOrder(obj) {
		obj.orderBy(this.table + '.created', 'ASC')
		return obj
	}
}

module.exports = new TicketComments()