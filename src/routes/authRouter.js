const router = require('express').Router();
const userController = require('./controllers/userController');

// Auth API
router.post('/', userController.postUser);
router.get('/verify-user-id', userController.verifyUserID);
router.get('/verify-nickname', userController.verifyNickname);

router.post('/sign-in', userController.signIn);
router.get('/sign-out', userController.signOut);
router.post('/token', userController.refresh);

module.exports = router;
