const router = require('express').Router();
const todoController = require('./controllers/todoController');

// TODO API
router.get('/', todoController.getTodos);
router.get('/:uuid', todoController.getTodoInfo);
router.post('/', todoController.addTodo);
router.patch('/:uuid', todoController.updateTodo);
router.delete('/:uuid', todoController.deleteTodo);

module.exports = router;
