const express = require('express')
	, auth = require('../../middleware/auth')
	, router = express.Router()
	, psApi = require('../../services/powerschoolapi')
router.get('/', auth.requireAuthentication, auth.getAccessToken, async (req, res) => {
	try {
		if (req.session.powerschool.profile && req.session.powerschool.profile.studentids) {
			const accessToken = req.session.token.access_token
			const studentPromises = psApi.getStudents(accessToken, req.session.powerschool.profile.studentids)
			if (studentPromises !== false) {
				const students = await studentPromises
				res.send(students)
				return
			}
		}
		/*
			const accessToken = req.session.token.access_token
			const studentPromises = psApi.getStudents(accessToken, [51])
			if (studentPromises !== false) {
				const students = await studentPromises
				res.send(students)
				return
			}
        */
	} catch(error) {
		console.log(error)
	}	
	res.send([])
})

router.get('/districts', auth.getAccessToken, async (req, res) => {
	let districtArray = []
	try {
		const accessToken = req.session.token.access_token
		const districts = await psApi.getDistricts(accessToken)
		if (districts.record && districts.record.length > 0) {
			for (const district of districts.record) {
				let { name, value } = district.tables.gen
				districtArray.push({label: name, value})
			}
		}
		res.send(districtArray)
		return
	} catch(error) {
		console.log(error)
		res.send(error)
		return
	}
	res.send([])

})

router.post('/', auth.getAccessToken, async (req, res) => {
	const data = req.body
	if (data) {
		try {
			const accessToken = req.session.token.access_token
			const updateStudent = await psApi.updateStudent(accessToken, data)
			if (updateStudent && updateStudent.results && updateStudent.results.result.warning_message) {
				console.log(JSON.stringify(updateStudent.results))
			}
			console.log(updateStudent.results.result)
			res.send(updateStudent)
			return
		 } catch(error) {
			console.log(error)
			res.send(error)
			return
		 }
	}
	res.send('Valid Contact ID/ Association ID must be provided')
})
module.exports = router