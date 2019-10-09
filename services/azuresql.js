const config = require('../config')
class AzureSql {
	constructor() {
		this.db = require('knex')({
			client: 'mssql',
			connection: {
				encrypt: true,
				port: 1433,
				database: 'lsc-jhs',
				server: 'lsc-db.database.windows.net',
				user: 'lsc_admin',
				password: process.env.AZURE_SQL_PASSWORD
			}
		})
		this.table = ''
	}
	all(limit = 100, offset = 0) {
		let items = []
		items = this.db.select()
			.from(this.table)
			.limit(limit)
		return items
	}

	find(itemId) {
		let item = []
		item = this.db
			.from(this.table)
			.where('id', itemId)
			.limit(1)
		return item
	}

	create(obj) {
		let newItem = this.db(this.table)
			.insert(obj)
			.returning('*')
		return newItem
	}

	save(obj, filters) {
		let item = this.db(this.table)
			.where(filters)
			.update(obj, ['id', 'description'])
		return item
	}
}

module.exports = AzureSql