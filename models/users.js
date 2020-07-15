const connection = require('../config/database.js').connect();
const SALT = require('../config/database.js').SALT;
const sha256 = require('sha256');

module.exports = {
	// Get User by UserID
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
	}
};
