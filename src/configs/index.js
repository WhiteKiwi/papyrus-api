require('dotenv').config();
const { ENVIRONMENT } = require('../utils/constants');

const ESSENTIAL_ENVIRONMENT_VARIABLES = [
	process.env.MYSQL_HOST,
	process.env.MYSQL_USER,
	process.env.MYSQL_PASSWORD,
	process.env.MYSQL_DATABASE,
	process.env.MYSQL_SALT,

	process.env.JWT_SECRET,
];
// PRODUCTION 전용 필수 환경변수들
if ([ENVIRONMENT.PRODUCTION, ENVIRONMENT.STAGING].includes((process.env.NODE_ENV || ENVIRONMENT.DEVELOPMENT).toUpperCase())) {
	ESSENTIAL_ENVIRONMENT_VARIABLES.push(process.env.SENTRY_DSN);
}
// 필수 환경 변수들이 비어있으면 throw Error
if (ESSENTIAL_ENVIRONMENT_VARIABLES.includes(undefined) || ESSENTIAL_ENVIRONMENT_VARIABLES.includes(''))
	throw new Error('⚠Missing Essential Environment Variables');

module.exports = {
	PORT: process.env.PORT || 3000,
	ENVIRONMENT: (process.env.NODE_ENV || ENVIRONMENT.DEVELOPMENT).toUpperCase(),
	MYSQL: {
		HOST: process.env.MYSQL_HOST || 'localhost',
		USER: process.env.MYSQL_USER || 'mysql',
		PASSWORD: process.env.MYSQL_PASSWORD || '',
		DATABASE: process.env.MYSQL_DATABASE || 'todolist_dev',
		PORT: process.env.MYSQL_PORT || '3306',
		SALT: process.env.MYSQL_SALT || 'localTest',
	},
	JWT: {
		SECRET: process.env.JWT_SECRET || 'localTest',
	},
	SENTRY: {
		DSN: process.env.SENTRY_DSN,
	},
};
