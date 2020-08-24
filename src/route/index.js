const router = require('express').Router();
const auth = require('../route/authRouter');
const user = require('../route/userRouter');
const todo = require('../route/todoRouter');

router.get('/', (req, res) => res.send('Hello, world!'));

router.use('/users', auth);
router.use('/users', user);
router.use('/todos', todo);

module.exports = router;
