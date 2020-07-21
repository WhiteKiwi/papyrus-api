const router = require('express').Router();
const todoController = require('./controllers/todoController');

// TODO API
router.get('/', todoController.getTodos);

module.exports = router;
