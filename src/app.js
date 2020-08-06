const express = require('express');
const app = express();
const config = require('./config');
const { HTTPStatusCode, ENVIRONMENT } = require('./constants');
const logger = require('morgan');
const Sentry = require('@sentry/node');
Sentry.init({ 
	dsn: config.SENTRY_DSN,
	environment: config.ENVIRONMENT,
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
app.use((req, res, next) => res.status(HTTPStatusCode.NotFound).json({ message: 'Not Found'}));
app.use((err, req, res, next) => res.status(HTTPStatusCode.InternalServerError).json({ message: 'Internal Server Error'}));


app.listen(app.get('port'), () => {
	console.log('TODO API Server listening on port ' + app.get('port'));
});

module.exports = app;
