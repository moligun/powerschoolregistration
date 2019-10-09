const express = require('express')
	, router = express.Router();

router.use('/auth', require('./auth'));
router.use('/tickets', require('./tickets'));

module.exports = router;
