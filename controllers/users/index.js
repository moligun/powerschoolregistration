const express = require('express')
	, router = express.Router()
	, Users = require('../../services/users')
	, TicketComments = require('../../services/ticketcomments')
	, Auth = require('../../middleware/auth')

router.get('/', Auth.requireAuthentication, async (req, res) => {
		const activePage = req.query.activePage
		let filters = req.query.filters
		if (typeof filters === 'string') {
			filters = JSON.parse(filters)
		} else {
			filters = ''
		}
		const limit = req.query.limit
		let userInfo
		try {
			userInfo = await Users.allWithCount(filters, limit, activePage)
		} catch(error) {
			console.log(error)
		}
		res.send(userInfo)
	}
)

router.get('/me', (req, res) => {
	if (req.user) {
		res.send(req.user);
		return
	}
	res.send('')

})

router.put('/user/:id', Auth.requireAuthentication, Auth.requireAdmin, async (req, res) => {
		const userId = req.params.id
		const { access_level } = req.body
		const filterObj = {id: userId}
		if (access_level < 0 || access_level > 2) {
			res.send({message:"Invalid value provided"})
			return
		}
		try { 
			updateUser = await Users.save({ access_level }, filterObj)			
		} catch(error) {
			console.log(error)
			console.log(updateUser)
		}
		let updatedObj = updateUser
		console.log(updatedObj)
		if (updatedObj !== undefined && 'id' in updatedObj) {
			res.send(updatedObj)
		} else {
			res.status(400).send({message: "Could not update user"})
		}
	}
)
module.exports = router;
