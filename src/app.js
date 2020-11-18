const Sentry = require('@sentry/node');
const express = require('express');
const configs = require('./configs');
const { HTTP_STATUS_CODE, ENVIRONMENT } = require('./utils/constants');
const { HTTPError, DBError } = require('./utils/errors');

function init(app) {
	// Sentry setting
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

	// Body parser
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());

	// Logger
	const logger = require('./middlewares/logger');
	app.use(logger);

	// Routers
	const api = require('./api');
	app.use(api);

	// Error Handlers
	// Handle 404 ERROR
	app.use((req, res, next) => res.status(HTTP_STATUS_CODE.NotFound).json({ message: 'Not Found' }));

	// Handle HTTP ERROR
	app.use((err, req, res, next) => {
		if (err instanceof HTTPError) {
			const scope = new Sentry.Scope();
			scope.setLevel('info');
			if (err.metaData) scope.setExtra('metaData', err.metaData);
			Sentry.captureException(err, scope);
			return res.status(err.statusCode).json({
				message: err.message || '예상치 못한 오류가 발생했습니다. 확인 후 빠르게 해결하겠습니다! 🙇‍',
			});
		}

		next(err);
	});

	// Handle DB ERROR
	app.use((err, req, res, next) => {
		if (err instanceof DBError) {
			const scope = new Sentry.Scope();
			scope.setExtra('query', err.query);
			scope.setExtra('originError', err.originError);
			Sentry.captureException(err, scope);
			return res.status(HTTP_STATUS_CODE.InternalServerError).json({
				message: '예상치 못한 오류가 발생했습니다. 확인 후 빠르게 해결하겠습니다! 🙇‍',
			});
		}

		next(err);
	});

	// Capture Error To Sentry
	app.use(Sentry.Handlers.errorHandler());
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
