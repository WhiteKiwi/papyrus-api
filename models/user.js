const connection = require('../configs/database.js').connect();
const SALT = require('../configs/database.js').SALT;
const sha256 = require('sha256');
const CustomError = require('../utility/CustomError.js');

module.exports = {
	// Get User Info by UserID
	getUser: function (user_id) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT uuid, user_id, nickname from users where user_id='${user_id}' LIMIT 1`, (err, results) => {
				if (err) {
					return reject(err);
				}
				
				if (results.length > 0) {
					resolve(results[0]);
				} else {
					return reject(new CustomError('404 Not Found', 404));
				}
			});
		});
	},
	// Add User
	addUser: function (user_id, password, nickname) {
		return new Promise(function (resolve, reject) {
			// TODO: Password SALT값 시간으로 설정해보기 - https://m.blog.naver.com/magnking/221149100913
			connection.query(`INSERT INTO users(user_id, password, nickname) VALUES('${user_id}', '${sha256(password + SALT)}', '${nickname}')`, (err, results) => {
				if (err) {
					return reject(err);
				}

				resolve();
			});
		});
	},
	// Update User Info
	// 	{
	// 		"uuid": "e3990bde-cb59-11ea-9d60-560002b4c70f",
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
			connection.query(`DELETE from users where user_id='${user_id}' and password='${sha256(password + SALT)}'`, (err, results) => {
				if (err) {
					return reject(err);
				}

				if (results.affectedRows > 0) {
					resolve();
				} else {
					// 유저가 없을 수도 있지만 accessToken이 있다는 것은 유저가 있다는 것이므로 401
					return reject(new CustomError('401 Incorrect Password', 401));
				}
			});
		});
	},
	// check password
	validatePassword: function (user_id, password) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT * from users where user_id='${user_id}' LIMIT 1`, (err, results) => {
				if (err) {
					return reject(err);
				}

				if (results[0].password === sha256(password + SALT))
					resolve(results[0]);
				else
					return reject(new CustomError('401 Incorrect Password', 401));
			});
		});
	},
	// check for duplicate User ID
	validateUserID: function (user_id) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT EXISTS (SELECT user_id from users where user_id='${user_id}') as isExist`, (err, results) => {
				if (err) {
					return reject(err);
				}
				
				resolve(results[0].isExist == 1 ? true : false);
			});
		});
	},
	// check for duplicate Nickname
	validateNickname: function (nickname) {
		return new Promise(function (resolve, reject) {
			connection.query(`SELECT EXISTS (SELECT nickname from users where nickname='${nickname}') as isExist`, (err, results) => {
				if (err) {
					return reject(err);
				}
				
				resolve(results[0].isExist == 1 ? true : false);
			});
		});
	},
	// update Password
	updatePassword: function (old_password, new_password) {
		// TODO: API 구현
	}
};
