const mysql = require('mysql2/promise');
const bluebird = require('bluebird');

let connectionPool = mysql.createPool({
	host: process.env.MYSQL_HOST || 'localhost',
	user: process.env.MYSQL_ID || 'mysql',
	password: process.env.MYSQL_PW || '',
	database: process.env.MYSQL_DATABASE || 'todolist_dev',
	port: process.env.MYSQL_PORT || '3306',
	Promise: bluebird,
});

module.exports = {
	connectionPool,
	SALT: process.env.SALT || 'localTest',
};
