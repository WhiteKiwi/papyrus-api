const Sentry = require('@sentry/node');
const express = require('express');
const logger = require('morgan');
const configs = require('./configs');
const { HTTP_STATUS_CODE, ENVIRONMENT } = require('./utils/constants');

function init(app) {
	Sentry.init({
		dsn: configs.SENTRY.DSN,
		environment: configs.ENVIRONMENT,
		beforeSend: (event, hint) => {
			if ([ENVIRONMENT.LOCAL, ENVIRONMENT.DEVELOPMENT].includes(configs.ENVIRONMENT)) {
				console.error(hint.originalException);

				// this drops the event and nothing will be send to sentry
				return null;
			}
	
			return event;
		}
	});

	// Middlewares
	app.use(Sentry.Handlers.requestHandler());

	if ([ENVIRONMENT.LOCAL, ENVIRONMENT.DEVELOPMENT].includes(configs.ENVIRONMENT))
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

app.listen(configs.PORT, () => {
	console.log('TODO API Server listening on port ' + configs.PORT);
});

module.exports = app;
