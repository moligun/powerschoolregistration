const AzureSql = require('./azuresql')
const LoginApi = require('./loginapi')
class Users extends AzureSql {
	constructor() {
		super()
		this.table = 'TACTicket_Users'
	}

	findOrCreate(obj) {
		const { id } = obj
		return this
			.find({azuread_id: id}).then((data) => {
				if (data && data.id) {
					return data
				} else {
					const createData = {
						azuread_id: obj.id,
						firstname: obj.givenName,
						lastname: obj.surname,
						lastfirst: obj.displayName,
						email: obj.mail
					}
					return this.create(createData)
				}
			})
	}

	applyFilters(item, filters) {
		if (typeof filters !== 'object') {
			return item
		}
		let queryFilters = filters
		for (let key in queryFilters) {
			if (key === 'search') {
				if (queryFilters[key] === undefined || queryFilters[key].length === 0) {
					continue
				}
				let searchTerm = queryFilters[key]
				item.where((builder) => {
					if (!parseInt(searchTerm)) {
						builder
							.where(this.table + '.lastfirst', 'LIKE', `%${searchTerm}%`)
							.orWhere(this.table + '.email', 'LIKE', `%${searchTerm}%`)

					}
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

module.exports = new Users()