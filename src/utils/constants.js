const HTTP_STATUS_CODE = {
	OK: 200,
	Created: 201,
	NoContent: 204,

	BadRequest: 400,
	Unauthorized: 401,
	Forbidden: 403,
	NotFound: 404,
	Conflict: 409,

	InternalServerError: 500,
};

const ENVIRONMENT = {
	LOCAL: 'LOCAL',
	DEVELOPMENT: 'DEVELOPMENT',
	STAGING: 'STAGING',
	PRODUCTION: 'PRODUCTION',
};

module.exports = {
	HTTP_STATUS_CODE,
	ENVIRONMENT,
};
