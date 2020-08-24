const router = require('express').Router();
const auth = require('./authRouter');
const user = require('./userRouter');
const todo = require('./todoRouter');

router.get('/', (req, res) => res.send('Hello, world!'));

router.use('/users', auth);
router.use('/users', user);
router.use('/todos', todo);

module.exports = router;
