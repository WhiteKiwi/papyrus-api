const router = require('express-promise-router')();
const userController = require('../controllers/userController');

// Middleware
const authChecker = require('../middlewares/authChecker');

// User API
router.get('/', authChecker, userController.getUser);
router.post('/', userController.postUser);
router.patch('/', authChecker, userController.patchUser);
router.delete('/', authChecker, userController.deleteUser);
router.patch('/password', authChecker, userController.patchUserPassword);

router.get('/verify-user-id', userController.verifyUserID);
router.get('/verify-nickname', userController.verifyNickname);

router.post('/sign-in', userController.signIn);
router.get('/sign-out', userController.signOut);
router.post('/token', userController.refresh);

module.exports = router;
