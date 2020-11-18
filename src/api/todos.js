const router = require('express-promise-router')();
const todoController = require('../controllers/todoController');

// Middleware
const authChecker = require('../middlewares/authChecker');
router.use(authChecker);

// Todo API
router.get('/', todoController.getTodos);
router.get('/:uuid', todoController.getTodo);
router.post('/', todoController.postTodo);
router.patch('/:uuid', todoController.patchTodo);
router.delete('/:uuid', todoController.deleteTodo);

module.exports = router;
