const express = require('express');
const middleware = require('./middleware');
const server = express();

const {authToken} = require('../admin/admin-middleware');
const adminRouter = require('../admin/admin-router');
const prisonRouter = require('../prisons/prison-router');
const prisonerRouter = require('../prisoners/prisoner-router');

middleware(server);

server.use('/api/admin', adminRouter);
server.use('/api/facilities', prisonRouter);
server.use('/api/inmates', prisonerRouter);

module.exports = server;