const express = require('express')
	, router = express.Router();

router.use('/auth', require('./auth'));
router.use('/students', require('./students'));
router.use('/users', require('./users'));
router.use('/contacts', require('./contacts'));

module.exports = router;
