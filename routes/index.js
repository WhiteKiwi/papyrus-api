const router = require('express').Router();
const controller = require('./controller');

router.get('/', controller.mainView);

module.exports = router;