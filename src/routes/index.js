const router = require('express').Router();
const auth = require('../routes/authRouter');
const user = require('../routes/userRouter');
const todo = require('../routes/todoRouter');

router.get('/', (req, res) => res.send('Hello, world!'));

router.use('/users', auth);
router.use('/users', user);
router.use('/todos', todo);

module.exports = router;
