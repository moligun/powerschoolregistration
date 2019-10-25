const express = require('express')
	, config = require('../../config')
	, router = express.Router()
	, Categories = require('../../services/categories')

router.get('/', async (req, res) => {
	try {
		const filters = {
			"type": "category"
		}
		const categories = await Categories.all(filters)
		res.send(categories)
		return
	} catch(error) {
		res.send({message: 'Issues listing primary categories'})
		return
	}
})

router.get('/category/:id/subcategories', async (req, res) => {
	const parentId = req.params.id
	if (parentId) {
		try {
			const filters = {
				"parent_id": parentId,
				"type": "subcategory"
			}
			const subcategories = await Categories.all(filters)
			res.send(subcategories)
			return
		 } catch(error) {
			res.send(error)
			return
		 }
	}
	res.send('Valid Category ID must be provided')
})

module.exports = router;
