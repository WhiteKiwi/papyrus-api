const { connectionPool } = require('../config/database.js');

// TODO: SQL Injection 방지
module.exports = {
	readTodos: async (userUUID) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let query = 'SELECT uuid, title, is_achieved as isAchieved from todos where user_uuid=?';
			let values = [userUUID];
			const [rows] = await connection.query(query, values);

			rows.forEach((row) => {
				row.isAchieved = row.isAchieved ? true : false;
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
	readTodo: async (userUUID, todoUUID) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let query = 'SELECT uuid, title, is_achieved as isAchieved from todos where user_uuid=? and uuid=?';
			let values = [userUUID, todoUUID];
			const [rows] = await connection.query(query, values);

			if (rows[0])
				rows[0].isAchieved = rows[0].isAchieved ? true : false;

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
	createTodo: async (userUUID, title) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let query = 'INSERT INTO todos(title, user_uuid) VALUES(?, ?)';
			let values = [title, userUUID];
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
	updateTodo: async (userUUID, todo) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let subQuery=[];
			for(let key in todo) {
				if (key == 'title') {
					subQuery.push(`title='${todo[key]}'`);
				} else if (key == 'isAchieved') {
					subQuery.push(`is_achieved='${todo[key] == true ? 1 : 0}'`);
				}
			}
			if (subQuery.length == 0)
				return false;

			let query = `UPDATE todos SET ${subQuery.join(', ')} where user_uuid=? AND uuid=?`;
			let values = [userUUID, todo.uuid];
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
	deleteTodo: async (userUUID, todoUUID) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			const query = 'DELETE from todos where user_uuid=? and uuid=?';
			const values = [userUUID, todoUUID];
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
