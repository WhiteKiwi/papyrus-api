const router = require('express').Router();
const todoController = require('./controllers/todoController');

// TODO API
router.get('/', todoController.getTodos);
router.get('/:uuid', todoController.getTodoInfo);
router.post('/', todoController.addTodo);
router.patch('/', todoController.updateTodo);
router.delete('/', todoController.deleteTodo);

module.exports = router;
