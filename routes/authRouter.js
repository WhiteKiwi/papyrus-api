const router = require('express').Router();
const userController = require('./controller/userController');

// Auth API
router.post('/', userController.signUp);
router.get('/validate-user-id', userController.validateUserID);
router.get('/validate-nickname', userController.validateNickname);

router.post('/sign-in', userController.signIn);
router.get('/sign-out', userController.signOut);
router.post('/token', userController.refresh);

module.exports = router;
