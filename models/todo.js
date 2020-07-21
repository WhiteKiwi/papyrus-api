const connection = require('../configs/database.js').connect();

module.exports = {
	// Get All Todos
	getTodos: function () {
		return new Promise(function (resolve, reject) {
			connection.query('SELECT * from todos', (err, rows, fields) => {
				if (err) {
					return reject(err);
				}
				resolve(rows);
			});
		});
	}
};
