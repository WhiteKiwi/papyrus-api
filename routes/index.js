const router = require('express').Router();
const todoController = require('../controller/todos');
const userController = require('../controller/users');

router.get('/', (req, res) => res.send('Hello, world!'));

// USER API
router.get('/users/', userController.getUserInfo);
router.post('/users/', userController.register);
router.patch('/users/', userController.updateUserInfo);
router.delete('/users/', userController.withdrawal);
router.get('/users/validate-user-id', userController.validateUserID);
router.get('/users/validate-nickname', userController.validateNickname);
router.patch('/users/change-password', userController.changePassword);

// TODO API
router.get('/todos/', todoController.getTodos);

module.exports = router;