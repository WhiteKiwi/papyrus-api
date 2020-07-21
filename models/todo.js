const connection = require('../configs/database.js').connect();

module.exports = {
	// Get All Todos
	getTodos: function (user_uuid) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT todos.uuid, todos.title, todos.is_achieved from todos left join users on users.uuid='${user_uuid}'`, (err, rows, fields) => {
				if (err) {
					return reject(err);
				}
				resolve(rows);
			});
		});
	},
	// Get Todo Info
	getTodo: function (user_uuid, todo_uuid) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT todos.* from todos left join users on users.uuid='${user_uuid}' where todos.uuid='${todo_uuid}'`, (err, rows, fields) => {
				if (err) {
					return reject(err);
				}
				resolve(rows[0]);
			});
		});
	},
	// Add Todo
	addTodo: function (user_uuid, title) {
		return new Promise(function (resolve, reject) {
			connection.query(`INSERT INTO todos(title, user_uuid) VALUES('${title}', '${user_uuid}')`, (err, rows, fields) => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	}
};
