const randomString = require('randomstring');
const verify = require('../middlewares/authenticate.js');
const orderItemMiddleware = require('../middlewares/orderItem.js');
const connection = require('../../../models/connection.js');
const route = require("express").Router();

module.exports = route;