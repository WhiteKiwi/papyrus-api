const router = require('express').Router();
const todoController = require('./controller/todoController');

// TODO API
router.get('/', todoController.getTodos);

module.exports = router;
