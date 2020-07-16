const router = require('express').Router();
const userController = require('./controller/userController');

// USER API
router.get('/', userController.getUserInfo);
router.patch('/', userController.updateUserInfo);
router.delete('/', userController.withdrawal);
router.patch('/change-password', userController.changePassword);

module.exports = router;
