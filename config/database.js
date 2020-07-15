const mysql = require('mysql');
require('dotenv').config();

const db_info = {
	host: process.env.DB_ADDR,
	user: process.env.MYSQL_ID,
	password: process.env.MYSQL_PW,
	database: 'todolist'
};

const SALT = process.env.SALT;

module.exports = {
	connect: function() {
		return mysql.createConnection(db_info);
	},
	'SALT': SALT
};
