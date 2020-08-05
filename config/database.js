const mysql = require('mysql2/promise');
const bluebird = require('bluebird');
require('dotenv').config();

let connectionPool = mysql.createPool({
	host: process.env.DB_ADDR || 'localhost',
	user: process.env.MYSQL_ID || 'mysql',
	password: process.env.MYSQL_PW || '',
	database: process.env.MYSQL_DATABASE || 'todolist_dev',
	port: process.env.MYSQL_PORT || '3306',
	Promise: bluebird,
});

module.exports = {
	connectionPool,
	SALT: process.env.SALT || 'localTest'
};
