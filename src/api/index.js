const router = require('express-promise-router')();
const users = require('./users');
const todos = require('./todos');

router.get('/', (req, res) => res.send('Hello, world!'));

router.use('/users', users);
router.use('/todos', todos);

module.exports = router;
