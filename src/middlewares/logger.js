const router = require('express').Router();
const logger = require('morgan');
const configs = require('../configs');
const { ENVIRONMENT } = require('../utils/constants');

if ([ENVIRONMENT.LOCAL, ENVIRONMENT.DEVELOPMENT].includes(configs.ENVIRONMENT))
	router.use(logger(':method :url - :response-time ms'));
else
	router.use(logger('short'));

module.exports = router;
