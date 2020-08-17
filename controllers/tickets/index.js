const express = require('express')
	, config = require('../../config')
	, router = express.Router()
	, Tickets = require('../../services/tickets')
	, TicketComments = require('../../services/ticketcomments')
	, Auth = require('../../middleware/auth')

router.get('/', Auth.requireAuthentication, async (req, res) => {
		const activePage = req.query.activePage
		const csvExport = req.query.csvExport
		let filters = req.query.filters
		if (typeof filters === 'string') {
			filters = JSON.parse(filters)
		} else {
			filters = ''
		}
		const limit = req.query.limit
		let ticketInfo
		try {
			ticketInfo = await Tickets.allWithCount(filters, limit, activePage)
		} catch(error) {
			console.log(error)
		}
		res.send(ticketInfo)
	}
)

router.get(
	'/ticket/:id', 
	(req, res, next) => {
		res.locals.skipStatusValues = ['OPEN']
		res.locals.flashError = {
			code: 403,
			message: 'You do not have permission'
		}
		return next()
	},
	Auth.requireTicketStatus,
	Auth.requireAuthentication,
	(req, res) => {
		res.send(res.locals.ticket)
	}
)

router.get('/ticket/:id/comments', Auth.requireAuthentication, async (req, res) => {
		const ticketId = req.params.id;
		let comments = [];
		try {
			comments = await TicketComments.allWithCount({"ticket_id": ticketId});
		} catch(error) {
			console.log(error);
		}
		res.send(comments);
	}
)

router.post(
	'/ticket/:id/comment',
	Auth.requireAuthentication, 
	(req, res, next) => {
		res.locals.skipStatusValues = ['OPEN', 'WIP']
		return next()
	},
	Auth.requireTicketStatus,
	Auth.requireAdmin,
	async (req, res) => {
		const ticket_id = req.params.id;
		const comment = req.body.comment
		const created_by = req.body.created_by
		const status = req.body.status
		const data = { ticket_id, comment, created_by, status }
		if (req.body.history) {
			data.history = req.body.history
		}
		let newComment = {};
		try {
			newComment = await TicketComments.create(data);
			if (newComment.length > 0) {
				newComment = newComment[0]
			}
		} catch(error) {
			console.log(error);
		}
		res.send(newComment);
	}
)

router.post('/ticket', async (req, res) => {
		const whiteListFields = ['title', 'description', 'category_id', 'subcategory_id', 'student_id', 'device_id']
		let data = {}
		for (const field of whiteListFields) {
			if (req.body[field]) {
				data[field] = req.body[field]
			}
		}
		let newTicket = {}
		try {
			newTicket = await Tickets.create(data)
			if (newTicket.length > 0) {
				newTicket = newTicket[0]
			}
		} catch(error) {
			console.log(error)
		}
		res.send(newTicket)
	}
)

router.put(
	'/ticket/:id', 
	Auth.requireAuthentication, 
	(req, res, next) => {
		res.locals.skipStatusValues = ['OPEN', 'WIP']
		return next()
	},
	Auth.requireTicketStatus,
	Auth.requireAdmin,
	async (req, res) => {
		const ticketId = req.params.id
		const filterObj = {id: ticketId}
		const data = {
			category_id: req.body.category_id,
			subcategory_id: req.body.subcategory_id,
			device_id: req.body.device_id
		}
		try { 
			updateTicket = await Tickets.save(data, filterObj)			
		} catch(error) {
			console.log(error)
			console.log(updateTicket)
		}
		let updatedObj = updateTicket
		console.log(updatedObj)
		if (updatedObj !== undefined && 'id' in updatedObj) {
			res.send(updatedObj)
		} else {
			res.status(400).send({message: "Could not update ticket"})
		}
	}
)
module.exports = router;
