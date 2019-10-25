const express = require('express')
	, router = express.Router();

router.use('/auth', require('./auth'));
router.use('/tickets', require('./tickets'));
router.use('/students', require('./students'));
router.use('/users', require('./users'));
router.use('/categories', require('./categories'));

module.exports = router;