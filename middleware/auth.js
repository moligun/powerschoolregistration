const Tickets = require('../services/tickets')
module.exports = {
	requireAuthentication: (req, res, next) => {
		if (res.locals.skipCheck === true) {
			return next()
		}
		if (req.isAuthenticated() && req.user.access_level > 0) {
			return next();
		} else {
			if (res.locals.flashError) {
				const { code, message } = res.locals.flashError
				res.status(code).send(message)
				return
			}
			req.session.originalUrl = '/';
			res.redirect('/auth/login');
		}
	},
	requireTicketStatus: async (req, res, next) => {
		const id = req.params.id
		let ticket
		try {
			ticket = await Tickets.find({ id })
		} catch(error) {
			console.log(error)
		}
		if (ticket) {
			if (res.locals.skipStatusValues.includes(ticket.status)) {
				res.locals.skipCheck = true
			}
			res.locals.ticket = ticket
			return next()
		}
		res.status(400).send('Cannot find ticket')
		return
	},
	requireAdmin: (req, res, next) => {
		if (req.user.access_level === 2 || res.locals.skipCheck === true) {
			return next();
		} else {
			res.status(403).send('Not permitted access');
		}
	},
	applyUserGlobals: (req, res, next) => {
		let impersonateActive = req.session.impersonated_staff !== undefined;
		res.locals.user = req.user;
		if (impersonateActive) {
			res.locals.staffInfo = req.session.impersonated_staff;
			res.locals.impersonated_staff = req.session.impersonated_staff;
		} else {
			res.locals.staffInfo = req.user !== undefined ? req.user.staffInfo : undefined;
			res.locals.impersonated_staff = undefined;
		}
		return next();
	}
}
