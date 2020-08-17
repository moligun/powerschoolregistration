const config = require('../config')
class AzureSql {
	constructor() {
		this.db = require('knex')(config.azureSql)
		this.table = ''
	}

	getOffset(limit, activePage) {
		return (activePage - 1) * limit
	}

	allWithCount(filters = '', limit = 100, activePage = 1) {
		let promises = []
		let countPromise = this.count(filters)
		let resultPromise = this.all(filters, limit, activePage)
		promises.push(countPromise)
		promises.push(resultPromise)
		return Promise.all(promises)
			.then((data) => {
				const firstObj = data.shift()
				if (firstObj[0].count !== 'undefined') {
					const count = firstObj[0].count
					const dataArray = data.shift()
					return {
						count,
						data: dataArray
					}
				}
				return firstObj

			})
	}

	count(filters = '') {
		let countPromise
		if (typeof filters === 'object') {
			countPromise = this.db(this.table)
			if (typeof this.applyJoins !== 'undefined') {
				countPromise = this.applyJoins(countPromise)
			}

			if (typeof this.applyFilters !== 'undefined') {
				countPromise = this.applyFilters(countPromise, filters)
			}
			countPromise
				.count('* as count')
				.then((data) => {
					return data[0]
				})
		} else {
			countPromise = this.db(this.table)
			if (typeof this.applyJoins !== 'undefined') {
				countPromise = this.applyJoins(countPromise)
			}
			countPromise
				.count('* as count')
				.then((data) => {
					return data[0]
				})
		}
		return countPromise

	}

	all(filters = '', limit = 100, activePage = 1) {
		let items = []
		let offset = this.getOffset(limit, activePage)
		items = this.db(this.table)
		if (typeof this.applyJoins !== 'undefined') {
			items = this.applyJoins(items)
		}
		if (typeof this.applySelect !== 'undefined') {
			items = this.applySelect(items)
		}
			items
				.limit(limit)
				.offset(offset)
		items = this.applyOrder(items)
		if (typeof filters === 'object' && typeof this.applyFilters !== 'undefined') {
			items = this.applyFilters(items, filters)
		}
		return items
	}

	applyOrder(obj) {
		obj.orderBy(this.table + '.created', 'DESC')
		return obj
	}

	applyFilters(obj, filters) {
		if (typeof filters !== 'object') {
			return obj
		}
		for (let key in filters) {
			if (Array.isArray(filters[key])) {
				obj.whereIn(key, filters[key])
			} else {
				obj.where(key, filters[key])
			}
		}
		return obj
	}

	find(obj) {
		let filter = obj
		if (typeof obj !== 'object') {
			filter = {
				id: obj
			}	
		}
		let item = this.db(this.table)
		if (typeof this.applyJoins !== 'undefined') {
			item = this.applyJoins(item)
		}

		if (typeof this.applySelect !== 'undefined') {
			item = this.applySelect(item)
		}

		if (typeof filter === 'object') {
			item = this.applyFilters(item, filter)
		}

		return item
			.then((response) => {
				if (response && response.length > 0) {
					return response.shift()
				}
				return response
			})
	}

	create(obj) {
		return this.db(this.table)
			.insert(obj)
			.returning('*')
			.then((response) => {
				if (response && response.length > 0) {
					return response.shift()
				}
				return response
			})
	}

	save(obj, filters) {
		return this.db(this.table)
			.where(filters)
			.update(obj, '*')
			.then((response) => {
				if (response && response.length > 0) {
					return response.shift()
				}
				return response
			})
	}
}

module.exports = AzureSql