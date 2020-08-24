const Sentry = require('@sentry/node');
const express = require('express');
const app = express();
const logger = require('morgan');
require('dotenv').config();
const config = require('./config');
const { HTTPStatusCode, ENVIRONMENT } = require('./constants');

Sentry.init({
	dsn: config.SENTRY_DSN,
	environment: config.ENVIRONMENT,
	beforeSend: event => {
		if (config.ENVIRONMENT == ENVIRONMENT.LOCAL || config.ENVIRONMENT == ENVIRONMENT.DEVELOPMENT) {
			console.error(event);
			// this drops the event and nothing will be send to sentry
			return null;
		}

		return event;
	}
});

app.set('port', config.PORT);

// Middlewares
app.use(Sentry.Handlers.requestHandler());

if (config.ENVIRONMENT == ENVIRONMENT.PRODUCTION || config.ENVIRONMENT == ENVIRONMENT.STAGING)
	app.use(logger('short'));
else if (config.ENVIRONMENT == ENVIRONMENT.DEVELOPMENT || config.ENVIRONMENT == ENVIRONMENT.LOCAL)
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
app.use((req, res, next) => res.status(HTTPStatusCode.NotFound).json({ message: 'Not Found' }));
app.use((err, req, res, next) => {
	if (err.statusCode && err.message)
		res.status(err.statusCode).json({ message: err.message });
	else
		res.status(HTTPStatusCode.InternalServerError).json({ message: 'Internal Server Error' });
});


app.listen(app.get('port'), () => {
	console.log('TODO API Server listening on port ' + app.get('port'));
});

module.exports = app;
