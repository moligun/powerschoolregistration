const AzureSql = require('./azuresql')
class Tickets extends AzureSql {
	constructor() {
		super()
		this.table = 'TACTickets'
	}

	applySelect(item) {
		return item
			.select(
				'TACTickets.*', 'C.title AS category', 
				'SUB.title AS subcategory', 
				'Comments.comment', 
				'Comments.created AS last_updated', 
				'Students.lastfirst AS studentname',
				'Students.student_number AS studentnumber'
			)
			.column(this.db.raw("ISNULL(Comments.status, 'OPEN') AS status"))
	}

	applyJoins(item) {
		item
			.leftOuterJoin('TACTicket_Categories AS C', this.table + '.category_id', 'C.id')
			.leftOuterJoin('TACTicket_Categories AS SUB', this.table + '.subcategory_id', 'SUB.id')
			.leftOuterJoin('TACTicket_Students AS Students', this.table + '.student_id', 'Students.id')
			.leftOuterJoin('TACTicket_Comments AS Comments', function() {
				this.on('Comments.ticket_id', '=', 'TACTickets.id').onNotExists(function() {
					this.select('*').from('TACTicket_Comments AS Comment1')
						.whereRaw("Comment1.ticket_id = TACTickets.id")
						.whereRaw('Comment1.id > Comments.id')
				})
			})
		return item
	}

	applyFilters(item, filters) {
		if (typeof filters !== 'object') {
			return item
		}
		let queryFilters = filters
		for (let key in queryFilters) {
			if (key === 'daterange') {
				const dateRange = queryFilters[key]
				if (typeof dateRange === 'object') {
					const isEmpty = Object.values(dateRange).every(x => (x === null || x === ''))
					if (isEmpty) {
						continue
					}
					item.where((builder) => {
						if (dateRange.startdate) {
							builder.where('TACTickets.created', '>=', dateRange.startdate)
						}
						if (dateRange.enddate) {
							builder.where('TACTickets.created', '<=', dateRange.enddate)
						}
						return builder
					})
				}
			} else if (key === 'status') {
				if (queryFilters[key] === undefined || queryFilters[key].length === 0) {
					continue
				}
				let statusArray = Array.from(queryFilters[key])
				if (statusArray.includes('OPEN')) {
					let openIndex = statusArray.indexOf('OPEN')
					item.where((builder) => { 
						if (statusArray && statusArray.length > 0) {
							builder.whereIn('Comments.status', statusArray)
						}
						builder.orWhereNull('Comments.status')
						return builder
					})
				} else {
					if (statusArray && statusArray.length > 0) {
						item.whereIn('Comments.status', statusArray)
					} 
				}
			} else if (key === 'search') {
				if (queryFilters[key] === undefined || queryFilters[key].length === 0) {
					continue
				}
				let searchTerm = queryFilters[key]
				item.where((builder) => {
					if (parseInt(searchTerm)) {
						builder
							.where(this.table + '.device_id', searchTerm)
							.orWhere('Students.student_number', searchTerm)

					}
					builder.orWhere('Students.lastfirst', 'LIKE', `%${searchTerm}%`)
					builder.orWhere('Comments.comment', 'LIKE', `%${searchTerm}%`)
					builder.orWhere(`${this.table}.description`, 'LIKE', `%${searchTerm}%`)
					return builder
				})
			} else if (typeof queryFilters[key] === 'array') {
				item.WhereIn(key, queryFilters[key]) 
			} else if (queryFilters[key]) {
				item.where(this.table + `.${key}`, queryFilters[key])
			}
		}
		return item
	}
}
module.exports = new Tickets()