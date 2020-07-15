const connection = require('../config/database.js').connect();

module.exports = {
	// Get User by ID
	getUser: function (id) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT * from users where id='${id}' LIMIT 1`, (err, rows, fields) => {
				if (err) {
					return reject(err);
				}
				resolve(rows[0]);
			});
		});
	}
};
