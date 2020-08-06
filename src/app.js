const express = require('express');
const app = express();
const ENV = require('./config/index');
const logger = require('morgan');
const Sentry = require('@sentry/node');
Sentry.init({ dsn: ENV.SENTRY_DSN });

app.set('port', ENV.PORT);

// Middlewares
const authChecker = require('./route/middleware/authChecker');

app.use(Sentry.Handlers.requestHandler());

if (ENV.ENVIRONMENT == 'production')
	app.use(logger('short'));
else if (ENV.ENVIRONMENT == 'develop' || ENV.ENVIRONMENT == 'local')
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
app.use('/users', authChecker, userRouter);
app.use('/todos', authChecker, todoRouter);

// Error Handler
app.use(Sentry.Handlers.errorHandler());
app.use((req, res, next) => res.status(404).json({ 'errorMsg': 'Not Found'}));
app.use((err, req, res, next) => res.status(500).json({ 'errorMsg': 'Internal Server Error'}));


app.listen(app.get('port'), () => {
	console.log('TODO API Server listening on port ' + app.get('port'));
});

module.exports = app;
