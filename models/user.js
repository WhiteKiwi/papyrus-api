const connection = require('../config/database.js').connect();
const SALT = require('../config/database.js').SALT;
const sha256 = require('sha256');

module.exports = {
	// Get User Info by UserID
	getUser: function (user_id) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT id, user_id, nickname from users where user_id='${user_id}' LIMIT 1`, (err, rows, fields) => {
				if (err) {
					return reject(err);
				}
				resolve(rows[0]);
			});
		});
	},
	// Add User
	addUser: function (user_id, password, nickname) {
		return new Promise(function (resolve, reject) {
			// TODO: Password SALT값 시간으로 설정해보기 - https://m.blog.naver.com/magnking/221149100913
			connection.query(`INSERT INTO users(user_id, password, nickname) VALUES('${user_id}', '${sha256(password + SALT)}', '${nickname}')`, (err, rows, fields) => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	},
	// Update User Info
	// 	{
	// 		"id": 1,
	//		"user_id": "changedUserID"
	//		"password": ""
	//		...
	// 	}
	updateUser: function (user) {
		// TODO: API 구현
	},
	// delete User by ID
	deleteUser: function (user_id, password) {
		return new Promise(function (resolve, reject) {
			connection.query(`DELETE from users where user_id='${user_id}'`, (err, result) => {
				if (err) {
					return reject(err);
				}
				
				resolve();
			});
		});
	},
	// check password
	validatePassword: function (user_id, password) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT * from users where user_id='${user_id}' LIMIT 1`, (err, rows, fields) => {
				if (err) {
					return reject(err);
				}

				if (rows[0].password === sha256(password + SALT))
					resolve(rows[0]);
				else
					resolve(null);
			});
		});
	},
	// check for duplicate User ID
	validateUserID: function (user_id) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT EXISTS (SELECT user_id from users where user_id='${user_id}') as isExist`, (err, rows) => {
				if (err) {
					return reject(err);
				}
				
				resolve(rows[0].isExist == 1 ? true : false);
			});
		});
	},
	// check for duplicate Nickname
	validateNickname: function (nickname) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT EXISTS (SELECT nickname from users where nickname='${nickname}') as isExist`, (err, rows) => {
				if (err) {
					return reject(err);
				}
				
				resolve(rows[0].isExist == 1 ? true : false);
			});
		});
	},
	// update Password
	updatePassword: function (old_password, new_password) {
		// TODO: API 구현
	}
};
