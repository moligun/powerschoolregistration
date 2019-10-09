const express = require('express')
	, config = require('../../config')
	, router = express.Router()
	, Tickets = require('../../services/tickets')
	, TicketComments = require('../../services/ticketcomments')

router.get('/', async (req, res) => {
		let tickets = []
		try {
			tickets = await Tickets.all()
		} catch(error) {
			console.log(error)
		}
		res.send(tickets)
	}
)

router.get('/ticket/:id', async (req, res) => {
		const ticketId = req.params.id;
		let ticket = [];
		try {
			ticket = await Tickets.find(ticketId);
		} catch(error) {
			console.log(error);
		}
		res.send(ticket);
	}
)

router.get('/ticket/:id/comments', async (req, res) => {
		const ticketId = req.params.id;
		let comments = [];
		try {
			comments = await TicketComments.all(ticketId);
		} catch(error) {
			console.log(error);
		}
		res.send(comments);
	}
)

router.post('/ticket/:id/comment', async (req, res) => {
		const ticket_id = req.params.id;
		const comment = req.body.comment
		const created_by = req.body.created_by
		const data = { ticket_id, comment, created_by }
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
		const description = req.body.description
		console.log(description)
		let newTicket = {}
		try {
			newTicket = await Tickets.create({ description })
			if (newTicket.length > 0) {
				newTicket = newTicket[0]
			}
		} catch(error) {
			console.log(error)
		}
		res.send(newTicket)
	}
)

router.put('/ticket/:id', async (req, res) => {
		const ticketId = req.params.id
		console.log('ticket:', ticketId)
		const filterObj = {id: ticketId}
		const description = req.body.description
		try { 
			updateTicket = await Tickets.save({ description }, filterObj)			
		} catch(error) {
			console.log(error)
			console.log(updateTicket)
		}
		let updatedObj = updateTicket[0]
		if (updatedObj !== undefined && 'id' in updatedObj) {
			res.send(updatedObj)
		} else {
			res.status(400).send({message: "Could not update ticket"})
		}
	}
)
module.exports = router;
