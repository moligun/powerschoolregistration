const express = require('express')
	, config = require('../../config')
	, router = express.Router()
	, Categories = require('../../services/categories')
	, Auth = require('../../middleware/auth')

router.get('/', async (req, res) => {
	try {
		let filters
		if (req.query.filters) {
			filters = JSON.parse(req.query.filters)
		} else {
			filters = {
				'type': 'category'
			}
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
				"parent_id": parentId
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

router.post('/category', Auth.requireAuthentication, Auth.requireAdmin, async (req, res) => {
		const whiteListFields = ['title', 'parent_id']
		let data = {}
		for (const field of whiteListFields) {
			if (req.body[field]) {
				data[field] = req.body[field]
			}
		}
		let newCategory = {}
		try {
			newCategory = await Categories.create(data)
			if (newCategory.length > 0) {
				newCategory = newCategory[0]
			}
		} catch(error) {
			console.log(error)
		}
		res.send(newCategory)
	}
)

router.put('/category/:id', Auth.requireAuthentication, Auth.requireAdmin, async (req, res) => {
		const categoryId = req.params.id
		const filterObj = {id: categoryId}
		const data = {
			parent_id: req.body.parent_id,
		}
		try { 
			updateCategory = await Categories.save(data, filterObj)			
		} catch(error) {
			console.log(error)
			console.log(updateCategory)
		}
		let updatedObj = updateCategory
		console.log(updatedObj)
		if (updatedObj !== undefined && 'id' in updatedObj) {
			res.send(updatedObj)
		} else {
			res.status(400).send({message: "Could not update category"})
		}
	}
)

module.exports = router;
