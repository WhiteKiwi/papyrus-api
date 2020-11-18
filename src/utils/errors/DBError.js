class DBError extends Error {
	constructor(message, query = '', originError = {}) {
		super(message);
		this.name = 'DBError';
		this.query = query.trim();
		this.originError = originError;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, DBError);
		}
	}
}

module.exports = DBError;
