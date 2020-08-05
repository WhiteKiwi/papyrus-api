const router = require('express').Router();
const todoController = require('./controller/todoController');

// Todo API
router.get('/', todoController.getTodos);
router.get('/:uuid', todoController.getTodo);
router.post('/', todoController.postTodo);
router.patch('/:uuid', todoController.patchTodo);
router.delete('/:uuid', todoController.deleteTodo);

module.exports = router;
