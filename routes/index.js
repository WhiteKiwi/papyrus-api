const router = require('express').Router();
const todoController = require('../controller/todos');
const userController = require('../controller/users');

router.get('/', (req, res) => res.send('Hello, world!'));

// USER API
router.get('/users/', userController.getUser);

// TODO API
router.get('/todos/', todoController.getTodos);

module.exports = router;