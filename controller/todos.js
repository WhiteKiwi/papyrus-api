const todos = require('../models/todos');

module.exports = {
	getTodos: function (req, res) {
		todos.getTodos().then((rows) => {
			res.json(rows);
		}).catch((err) => { 
			console.log(err);
			throw err; 
		});
	}
};