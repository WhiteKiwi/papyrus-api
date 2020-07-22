const express = require('express');
const app = express();
const ENV = require('./configs/index');

const logger = require('morgan');
const Sentry = require('@sentry/node');
Sentry.init({ dsn: ENV.SENTRY_DSN });

const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const todoRouter = require('./routes/todoRouter');

const authChecker = require('./routes/middlewares/authChecker');

app.set('port', ENV.PORT);

app.use(Sentry.Handlers.requestHandler());

if (ENV.ENVIRONMENT == 'production')
	app.use(logger('short'));
else if (ENV.ENVIRONMENT == 'develop' || ENV.ENVIRONMENT == 'local')
	app.use(logger(':method :url - :response-time ms'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(indexRouter);
app.use('/users', authRouter);
app.use('/users', authChecker, userRouter);
app.use('/todos', authChecker, todoRouter);

app.use(Sentry.Handlers.errorHandler());
app.use((err, req, res, next) => {
	res.statusCode = 500;
	res.end('Internal Server Error');
});

app.listen(app.get('port'), () => {
	console.log('TODO API Server listening on port ' + app.get('port'));
});

module.exports = app;
