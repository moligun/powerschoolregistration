const express = require('express')
	, router = express.Router();

router.use('/registration', require('./registration'));

module.exports = router;
