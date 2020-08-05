const { connectionPool, SALT } = require('../config/database.js');
const sha256 = require('sha256');

module.exports = {
	readUserByUserID: async (user_id) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let query = 'SELECT * from users where user_id=? LIMIT 1';
			let values = [user_id];
			const [rows] = await connection.query(query, values);

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
	readUserByNickname: async (nickname) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let query = 'SELECT * from users where nickname=? LIMIT 1';
			let values = [nickname];
			const [rows] = await connection.query(query, values);

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
	readUserByUserIDAndPassword: async (user_id, password) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			const query = 'SELECT * from users where user_id=? and password=? LIMIT 1';
			const values = [user_id, sha256(password + SALT)];
			const [rows] = await connection.query(query, values);

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
	createUser: async (user_id, password, nickname) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let query = 'INSERT INTO users(user_id, password, nickname) VALUES(?, ?, ?)';
			// TODO: Password SALT값 시간으로 설정해보기 - https://m.blog.naver.com/magnking/221149100913
			let values = [user_id, sha256(password + SALT), nickname];
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
	// Update User Info
	// 	{
	// 		"uuid": "e3990bde-cb59-11ea-9d60-560002b4c70f",
	//		"user_id": "changedUserID"
	//		"password": ""
	//		...
	// 	}
	updateUser: (user) => {
		// TODO: API 구현
	},
	deleteUser: async (user_id, password) => {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			const query = 'DELETE from users where user_id=? and password=?';
			const values = [user_id, sha256(password + SALT)];
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
	// update Password
	updatePassword: (old_password, new_password) => {
		// TODO: API 구현
	},
};
