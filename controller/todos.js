const Todos = require('../models/todos');

module.exports = {
	getTodos: function (req, res) {
		Todos.getTodos().then((rows) => {
			res.send(rows);
		}).catch((err) => { 
			console.log(err);
			throw err; 
		});
	}
};