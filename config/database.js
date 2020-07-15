const mysql = require('mysql');
require('dotenv').config();

let db_info = {
	host: process.env.DB_ADDR,
	user: process.env.MYSQL_ID,
	password: process.env.MYSQL_PW,
	database: 'todolist'
};

module.exports = {
	connect: function() {
		return mysql.createConnection(db_info);
	}
};
