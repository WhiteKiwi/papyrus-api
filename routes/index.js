const router = require('express').Router();
const todoController = require('../controller/todos');

router.get('/', todoController.getTodos);

module.exports = router;