const AzureSql = require('./azuresql')
class TicketComments extends AzureSql {
	constructor() {
		super()
		this.table = 'TACTicket_Comments'
	}

	all(ticket_id, limit = 100, offset = 0) {
		const filter = { ticket_id }
		return super
			.all(limit, offset)
			.where(filter)
	}
}

module.exports = new TicketComments()