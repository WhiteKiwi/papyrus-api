class CustomError extends Error {
	constructor(errorMessage, httpStatusCode) {
		super(errorMessage);

		this.httpStatusCode = httpStatusCode;
		this.type = 'custom';
	}
}

module.exports = CustomError;