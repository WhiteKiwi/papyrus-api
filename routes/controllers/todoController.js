const TODO = require('../../models/todo');

module.exports = {
	getTodos: function (req, res) {
		TODO.getTodos(req.user).then((rows) => {
			res.json(rows);
		}).catch((err) => { 
			console.log(err);
			throw err; 
		});
	}
};