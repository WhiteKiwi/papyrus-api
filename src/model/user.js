const { connectionPool, SALT } = require('../config/database.js');
const sha256 = require('sha256');

class UserRepository {
	constructor() {
		const self = {};

		self.readByUserID = this.readByUserID;
		self.readByNickname = this.readByNickname;
		self.readByUserIDAndPassword = this.readByUserIDAndPassword;

		self.create = this.create;
		
		self.update = this.update;
		self.updatePassword = this.updatePassword;

		self.delete = this.delete;

		return self;
	}

	async readByUserID(userID) {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let query = 'SELECT uuid, user_id as userID, password, nickname from users where user_id=? LIMIT 1';
			let values = [userID];
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
	}

	async readByNickname(nickname) {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let query = 'SELECT uuid, user_id as userID, password, nickname from users where nickname=? LIMIT 1';
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
	}

	async readByUserIDAndPassword(userID, password) {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			const query = 'SELECT uuid, user_id as userID, password, nickname from users where user_id=? and password=? LIMIT 1';
			const values = [userID, sha256(password + SALT)];
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
	}

	async create(userID, password, nickname) {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			let query = 'INSERT INTO users(user_id, password, nickname) VALUES(?, ?, ?)';
			// TODO: Password SALT값 시간으로 설정해보기 - https://m.blog.naver.com/magnking/221149100913
			let values = [userID, sha256(password + SALT), nickname];
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

	// Update User Info
	// 	{
	// 		"uuid": "e3990bde-cb59-11ea-9d60-560002b4c70f",
	//		"user_id": "changedUserID"
	//		"password": ""
	//		...
	// 	}
	update(user) {
		// TODO: API 구현
	}

	updatePassword(userID, oldPassword, newPassword) {
		// TODO: API 구현
	}

	async delete(userID, password) {
		let connection = await connectionPool.getConnection(async (conn) => conn);

		try {
			const query = 'DELETE from users where user_id=? and password=?';
			const values = [userID, sha256(password + SALT)];
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
}

module.exports = UserRepository;
