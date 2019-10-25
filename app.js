/**
 * Copyright (c) Microsoft Corporation
 *  All Rights Reserved
 *  MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the 'Software'), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
 * OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

/******************************************************************************
 * Module dependencies.
 *****************************************************************************/

const express = require('express');
const https = require('https');
const fs = require('fs');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const logger = require('morgan');
const bunyan = require('bunyan');
const Passport = require('./services/passport');
const passport = Passport();
const config = require('./config');
const path = require('path');
const redis = require('redis');
const redisStore = require('connect-redis')(expressSession);
const redisClient = redis.createClient(6380, config.redisURL, {
	auth_pass: config.redisPass,
	tls: {
		servername: config.redisURL
}});
const authMiddle = require('./middleware/auth');
const log = bunyan.createLogger({
    name: 'LSC Azure AD'
});

//-----------------------------------------------------------------------------
// Config the app, include middlewares
//-----------------------------------------------------------------------------
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(logger());
app.use(methodOverride());

const secureCookie = (process.env.ENVIRONMENT == 'DEVELOPMENT') ? false : true;
app.use(expressSession({
	secret: 'er86y4hjk2x', 
	store: new redisStore({
		client: redisClient
	}),
	proxy: true,
	resave: false, 
	saveUninitialized: true,
	cookie: {secure: secureCookie, maxAge: 3600000}
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true }));

app.use(passport.initialize());
app.use(passport.session());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(require('./controllers'));
app.get('/', (req, res) => {
	/*
	const groupId = config.adminGroup;
	const errors = [];
	let sess = req.session;
	if (sess && sess.error) {
		errors.push(sess.error);
		sess.error = null;
	}
	console.log(req.user)
	res.render('index', { user: req.user, errors: errors });
	*/
	res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
if (process.env.ENVIRONMENT == 'DEVELOPMENT') {
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
	https.createServer({
		key: fs.readFileSync('../server.key'),
		cert: fs.readFileSync('../server.cert')
	}, app).listen(3000);
} else {
	module.exports = app;
}
