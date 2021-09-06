const randomString = require('randomstring');
const verify = require('../middlewares/authenticate.js');
const orderMiddleware = require('../middlewares/order.js');
const connection = require('../../../models/connection.js');
const route = require("express").Router();

module.exports = route;