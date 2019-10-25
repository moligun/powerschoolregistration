const express = require('express')
	, config = require('../../config')
	, router = express.Router()
	, PSApi = require('../../services/powerschoolapi')
	, Students = require('../../services/students')

router.get('/student/:student_number/:type', async (req, res) => {
	const studentNumber = req.params.student_number;
	const idType = req.params.type;
	try {
		if (studentNumber && idType) {
			const databaseResults = await Students.findOrCreate({[idType]: studentNumber}); 
			if (databaseResults) {
				res.send(databaseResults);
				return;
			}
		}
	} catch(error) {
		res.send({message: 'Issues finding student by that ID'})
		return;
	}
	res.send({message: 'Issues finding student by that ID'})
})

module.exports = router;
