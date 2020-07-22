require('dotenv').config();

module.exports = {
	ENVIRONMENT: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 3000,
	SENTRY_DSN: process.env.SENTRY_DSN
};