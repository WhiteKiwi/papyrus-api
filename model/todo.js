const { connectionPool } = require('../config/database.js');

// TODO: SQL Injection 방지
module.exports = {
	readTodos: async (user_uuid) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let query = 'SELECT uuid, title, is_achieved from todos where user_uuid=?';
			let values = [user_uuid];
			const [rows] = await connection.query(query, values);

			rows.forEach((row) => {
				row.is_achieved = row.is_achieved ? true : false;
			});

			return rows;
		} catch (err) {
			if (err) {
				throw err;
			}
		} finally {
			connection.release();
		}

		return null;
	},
	readTodo: async (user_uuid, todo_uuid) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let query = 'SELECT * from todos where user_uuid=? and uuid=?';
			let values = [user_uuid, todo_uuid];
			const [rows] = await connection.query(query, values);

			if (rows[0]) {
				rows[0].is_achieved = rows[0].is_achieved ? true : false;
			}

			return rows[0];
		} catch (err) {
			if (err) {
				throw err;
			}
		} finally {
			connection.release();
		}

		return null;
	},
	createTodo: async (user_uuid, title) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let query = 'INSERT INTO todos(title, user_uuid) VALUES(?, ?)';
			let values = [title, user_uuid];
			const [results] = await connection.query(query, values);

			return results.affectedRows > 0 ? true : false;
		} catch (err) {
			if (err) {
				throw err;
			}
		} finally {
			connection.release();
		}

		return null;
	},
	updateTodo: async (user_uuid, todo) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let columns=[];
			for(let key in todo) {
				if (key == 'title') {
					columns.push(`title='${todo[key]}'`);
				} else if (key == 'is_achieved') {
					columns.push(`is_achieved='${todo[key] == true ? 1 : 0}'`);
				}
			}
			if (columns.length == 0)
				return false;

			let query = `UPDATE todos SET ${columns.join(', ')} where user_uuid=? AND uuid=?`;
			let values = [user_uuid, todo.uuid];
			const [results] = await connection.query(query, values);

			return results.affectedRows > 0 ? true : false;
		} catch (err) {
			if (err) {
				throw err;
			}
		} finally {
			connection.release();
		}

		return null;
	},
	deleteTodo: async (user_uuid, todo_uuid) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			const query = 'DELETE from todos where user_uuid=? and uuid=?';
			const values = [user_uuid, todo_uuid];
			const [results] = await connection.query(query, values);

			return results.affectedRows > 0 ? true : false;
		} catch (err) {
			if (err) {
				throw err;
			}
		} finally {
			connection.release();
		}

		return null;
	}
};
