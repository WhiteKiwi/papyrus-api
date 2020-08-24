const { ENVIRONMENT } = require('../constants');

module.exports = {
	ENVIRONMENT: (process.env.NODE_ENV || ENVIRONMENT.DEVELOPMENT).toUpperCase(),
	PORT: process.env.PORT || 3000,
	SENTRY_DSN: process.env.SENTRY_DSN,
};
