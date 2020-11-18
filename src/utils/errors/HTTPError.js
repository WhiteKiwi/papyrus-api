const { HTTP_STATUS_CODE } = require('../constants');

class HTTPError extends Error {
	constructor({ message = '', statusCode = 500, metaData = '' }) {
		super(message);
		switch (statusCode) {
		case HTTP_STATUS_CODE.BadRequest:
			this.name = 'BadRequestError';
			if (!message) this.message = '필요한 정보가 누락되었습니다.';
			break;
		case HTTP_STATUS_CODE.Unauthorized:
			this.name = 'UnauthorizedUserError';
			if (!message) this.message = '인증에 실패하였습니다.';
			break;
		case HTTP_STATUS_CODE.InternalServerError:
			this.name = 'InternalServerError';
			break;
		default:
			this.name = `HTTP${statusCode}Error`;
		}
		this.statusCode = statusCode;
		this.metaData = metaData;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, HTTPError);
		}
	}
}

module.exports = HTTPError;
