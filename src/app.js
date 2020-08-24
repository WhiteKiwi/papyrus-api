const Sentry = require('@sentry/node');
const express = require('express');
const app = express();
const logger = require('morgan');
require('dotenv').config();
const config = require('./config');
const { HTTP_STATUS_CODE, ENVIRONMENT } = require('./constants');

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

app.set('port', config.PORT);

// Middlewares
app.use(Sentry.Handlers.requestHandler());

if ([ENVIRONMENT.PRODUCTION, ENVIRONMENT.STAGING].includes(config.ENVIRONMENT))
	app.use(logger('short'));
else
	app.use(logger(':method :url - :response-time ms'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routers
const indexRouter = require('./route/indexRouter');
const authRouter = require('./route/authRouter');
const userRouter = require('./route/userRouter');
const todoRouter = require('./route/todoRouter');

app.use(indexRouter);
app.use('/users', authRouter);
app.use('/users', userRouter);
app.use('/todos', todoRouter);

// Error Handler
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


app.listen(app.get('port'), () => {
	console.log('TODO API Server listening on port ' + app.get('port'));
});

module.exports = app;
