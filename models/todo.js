const connection = require('../configs/database.js').connect();

module.exports = {
	// Get All Todos
	getTodos: function (user_uuid) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT todos.uuid, todos.title, todos.is_achieved from todos left join users on users.uuid='${user_uuid}'`, (err, rows, fields) => {
				if (err) {
					return reject(err);
				}

				rows.forEach(function(r) {
					r.is_achieved = r.is_achieved ? true : false;
				});
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

				rows[0].is_achieved = rows[0].is_achieved ? true : false;
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
	},
	// Update Todo
	updateTodo: function (user_uuid, todo) {
		return new Promise(function (resolve, reject) {
			let sub_query='';
			Object.keys(todo).forEach(function (key) {
				if (key == 'title') {
					sub_query += `title='${todo[key]}', `;
				} else if (key == 'is_achieved') {
					sub_query += `is_achieved='${todo[key] == true ? 1 : 0}', `;
				}
			});

			if (sub_query) {
				connection.query(`UPDATE todos SET ${sub_query.substring(0, sub_query.length-2)} where user_uuid='${user_uuid}' AND uuid='${todo.uuid}'`, (err, rows, fields) => {
					if (err) {
						return reject(err);
					}
					resolve();
				});
			} else {
				let err = new Error('요청한 정보가 잘못되었습니다.');
				err.httpStatusCode = 400;
				return reject(err);
			}
		});
	},
	// delete Todo by UUID
	deleteTodo: function (user_uuid, todo_uuid) {
		return new Promise(function (resolve, reject) {
			connection.query(`DELETE from todos where user_uuid='${user_uuid}' and uuid='${todo_uuid}'`, (err, rows) => {
				if (err) {
					return reject(err);
				}

				resolve();
			});
		});
	}
};
