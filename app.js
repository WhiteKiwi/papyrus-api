const express = require('express');
const app = express();
const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const todoRouter = require('./routes/todoRouter');

const authChecker = require('./routes/middlewares/authChecker');

app.set('port', process.env.PORT || 3000);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(indexRouter);
app.use('/users', authRouter);
app.use('/users', authChecker, userRouter);
app.use('/todos', authChecker, todoRouter);

app.listen(app.get('port'), () => {
	console.log('TODO API Server listening on port ' + app.get('port'));
});

module.exports = app;
