const Sentry = require('@sentry/node');
const sha256 = require('sha256');
const DB = require('../utils/database.js');
const configs = require('../configs');

class UserRepository {
	constructor() {
		this.db = new DB();
	}

	async readByUserID(userID) {
		try {
			const query = 'SELECT uuid, user_id as userID, password, nickname from users where user_id=? LIMIT 1';
			const params = [userID];
			const data = await this.db.query(query, params);

			return data[0];
		} catch (e) {
			Sentry.captureException(e);
		}

		return null;
	}

	async readByNickname(nickname) {
		try {
			const query = 'SELECT uuid, user_id as userID, password, nickname from users where nickname=? LIMIT 1';
			const params = [nickname];
			const data = await this.db.query(query, params);

			return data[0];
		} catch (e) {
			Sentry.captureException(e);
		}

		return null;
	}

	async readByUserIDAndPassword(userID, password) {
		try {
			const query = 'SELECT uuid, user_id as userID, password, nickname from users where user_id=? and password=? LIMIT 1';
			const params = [userID, sha256(password + configs.MYSQL.SALT)];
			const data = await this.db.query(query, params);

			return data[0];
		} catch (e) {
			Sentry.captureException(e);
		}

		return null;
	}

	async create(userID, password, nickname) {
		try {
			const query = 'INSERT INTO users(user_id, password, nickname) VALUES(?, ?, ?)';
			// TODO: Password SALT값 시간으로 설정해보기 - https://m.blog.naver.com/magnking/221149100913
			const params = [userID, sha256(password + configs.MYSQL.SALT), nickname];
			const data = await this.db.query(query, params);

			return data.affectedRows > 0 ? true : false;
		} catch (e) {
			Sentry.captureException(e);
			throw e;
		}
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
		try {
			const query = 'DELETE from users where user_id=? and password=?';
			const params = [userID, sha256(password + configs.MYSQL.SALT)];
			const data = await this.db.query(query, params);

			return data.affectedRows > 0 ? true : false;
		} catch (e) {
			Sentry.captureException(e);
		}

		return null;
	}
}

module.exports = UserRepository;
