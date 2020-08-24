const mysql = require('mysql2/promise');
const bluebird = require('bluebird');
const configs = require('../configs');

let connectionPool = mysql.createPool({
	host: configs.MYSQL.HOST,
	user: configs.MYSQL.USER,
	password: configs.MYSQL.PASSWORD,
	database: configs.MYSQL.DATABASE,
	port: configs.MYSQL.PORT,
	Promise: bluebird,
});

class DB {
	/**
     * @param {string} query
     * @param {Array} params
     */
	async query(query, params) {
		let connection;
		try {
			connection = await connectionPool.getConnection(async (conn) => conn);
			const [data] = await connection.query(query, params);
			return data;
		} finally {
			if (connection) connection.release();
		}
	}
}

module.exports = DB;
