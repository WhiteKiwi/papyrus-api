const connection = require('../configs/database.js').connect();
const CustomError = require('../utility/CustomError.js');

module.exports = {
	// Get All Todos
	getTodos: function (user_uuid) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT todos.uuid, todos.title, todos.is_achieved from todos where user_uuid='${user_uuid}'`, (err, results) => {
				if (err) {
					return reject(err);
				}

				results.forEach(function(r) {
					r.is_achieved = r.is_achieved ? true : false;
				});
				resolve(results);
			});
		});
	},
	// Get Todo Info
	getTodo: function (user_uuid, todo_uuid) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT todos.* from todos where user_uuid='${user_uuid}' and uuid='${todo_uuid}'`, (err, results) => {
				if (err) {
					return reject(err);
				}
				
				if (results.length > 0) {
					results[0].is_achieved = results[0].is_achieved ? true : false;
					resolve(results[0]);
				} else {
					return reject(new CustomError('404 Not Found', 404));
				}
			});
		});
	},
	// Add Todo
	addTodo: function (user_uuid, title) {
		return new Promise(function (resolve, reject) {
			connection.query(`INSERT INTO todos(title, user_uuid) VALUES('${title}', '${user_uuid}')`, (err, results) => {
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
			for(let key in todo) {
				if (key == 'title') {
					sub_query += `title='${todo[key]}', `;
				} else if (key == 'is_achieved') {
					sub_query += `is_achieved='${todo[key] == true ? 1 : 0}', `;
				}
			}

			if (sub_query) {
				connection.query(`UPDATE todos SET ${sub_query.substring(0, sub_query.length-2)} where user_uuid='${user_uuid}' AND uuid='${todo.uuid}'`, (err, results) => {
					if (err) {
						return reject(err);
					}
					if (results.affectedRows > 0) {
						resolve();
					} else {
						return reject(new CustomError('404 Not Found', 404));
					}
				});
			} else {
				return reject(new CustomError('요청한 정보가 잘못되었습니다.', 400));
			}
		});
	},
	// delete Todo by UUID
	deleteTodo: function (user_uuid, todo_uuid) {
		return new Promise(function (resolve, reject) {
			connection.query(`DELETE from todos where user_uuid='${user_uuid}' and uuid='${todo_uuid}'`, (err, results) => {
				if (err) {
					return reject(err);
				}

				if (results.affectedRows > 0) {
					resolve();
				} else {
					return reject(new CustomError('404 Not Found', 404));
				}
			});
		});
	}
};
