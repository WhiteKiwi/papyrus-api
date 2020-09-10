const sha256 = require('sha256');
const configs = require('../configs');
const DB = require('../utils/database');
const { Q } = require('../utils/constants');
const errorGenerator = require('../utils/error-gen');

class UserRepository {
	constructor() {
		this.db = new DB();
	}

	async readByUserID(userID) {
		const query = `SELECT uuid, user_id as userID, password, nickname from users where user_id=${Q} LIMIT 1`;
		const params = [userID];
		const data = await this.db.query(query, params);

		return data[0];
	}

	async readByNickname(nickname) {
		const query = `SELECT uuid, user_id as userID, password, nickname from users where nickname=${Q} LIMIT 1`;
		const params = [nickname];
		const data = await this.db.query(query, params);

		return data[0];
	}

	async readByUserIDAndPassword(userID, password) {
		const query = `SELECT uuid, user_id as userID, password, nickname from users where user_id=${Q} and password=${Q} LIMIT 1`;
		const params = [userID, sha256(password + configs.MYSQL.SALT)];
		const data = await this.db.query(query, params);

		return data[0];
	}

	async create(userID, password, nickname) {
		try {
			const query = `INSERT INTO users(user_id, password, nickname) VALUES(${Q}, ${Q}, ${Q})`;
			// TODO: Password SALT값 시간으로 설정해보기 - https://m.blog.naver.com/magnking/221149100913
			const params = [userID, sha256(password + configs.MYSQL.SALT), nickname];
			const data = await this.db.query(query, params);

			return data.affectedRows > 0 ? true : false;
		} catch (e) {
			if (e.errno === 1062) { // MySql Error No.
				throw errorGenerator(1062, 'User ID 또는 Nickname이 중복되었습니다.');
			} else
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
		const query = `DELETE from users where user_id=${Q} and password=${Q}`;
		const params = [userID, sha256(password + configs.MYSQL.SALT)];
		const data = await this.db.query(query, params);

		return data.affectedRows > 0 ? true : false;
	}

	async verifyUserID(userID) {
		const query = `SELECT EXISTS (select * from users where user_id=${Q}) as success`;
		const params = [userID];
		const data = await this.db.query(query, params);

		return data[0].success == 0;
	}

	async verifyNickname(nickname) {
		const query = `SELECT EXISTS (select * from users where nickname=${Q}) as success`;
		const params = [nickname];
		const data = await this.db.query(query, params);

		return data[0].success == 0;
	}
}

module.exports = UserRepository;
