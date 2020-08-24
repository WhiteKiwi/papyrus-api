const Sentry = require('@sentry/node');
const express = require('express');
const logger = require('morgan');
require('dotenv').config();
const config = require('./configs');
const { HTTP_STATUS_CODE, ENVIRONMENT } = require('./constants');

function init(app) {
	Sentry.init({
		dsn: config.SENTRY_DSN,
		environment: config.ENVIRONMENT,
		beforeSend: (event, hint) => {
			if ([ENVIRONMENT.LOCAL, ENVIRONMENT.DEVELOPMENT].includes(config.ENVIRONMENT)) {
				console.error(hint.originalException);

				// this drops the event and nothing will be send to sentry
				return null;
			}
	
			return event;
		}
	});

	// Middlewares
	app.use(Sentry.Handlers.requestHandler());

	if ([ENVIRONMENT.LOCAL, ENVIRONMENT.DEVELOPMENT].includes(config.ENVIRONMENT))
		app.use(logger(':method :url - :response-time ms'));
	else
		app.use(logger('short'));

	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());

	// Routers
	const routers = require('./routes');
	app.use(routers);

	// Error Handlers
	app.use(Sentry.Handlers.errorHandler());
	app.use((req, res, next) => res.status(HTTP_STATUS_CODE.NotFound).json({ message: 'Not Found' }));
	app.use((e, req, res, next) => {
		if (e.statusCode && e.message)
			res.status(e.statusCode).json({ message: e.message });
		else {
			Sentry.captureException(e);
			res.status(HTTP_STATUS_CODE.InternalServerError).json({ message: 'Internal Server Error' });
		}
	});
}

const app = express();
init(app);

app.listen(config.PORT, () => {
	console.log('TODO API Server listening on port ' + config.PORT);
});

module.exports = app;
