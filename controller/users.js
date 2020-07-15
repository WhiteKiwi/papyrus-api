const users = require('../models/users');

module.exports = {
	getUser: function (req, res) {
		if (req.query.id) {
			users.getUser(req.query.id).then((user) => {
				res.json(user);
			}).catch((err) => {
				console.log(err);
				throw err;
			});
		} else {
			res.status(400).json({'error': 'user id가 필요합니다.'});
		}
	}
};