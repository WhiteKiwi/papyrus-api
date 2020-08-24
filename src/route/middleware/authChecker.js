const jwt = require('jsonwebtoken');
const { SECRET } = require('../../config/jwt');
const { HTTPStatusCode } = require('../../constants');

// authChecker - jwt token 인증 후 payload에서 user 정보를 뽑아서 req.user에 담아줌
module.exports = (req, res, next) => {
	if (req.headers.authorization) {
		const token = req.headers.authorization.split('Bearer ')[1];

		let user = jwt.verify(token, SECRET);
		if (user) {
			req.user = {
				uuid: user.uuid,	
				userID: user.userID,
				nickname: user.nickname
			};
			next();
		} else {
			res.status(HTTPStatusCode.Unauthorized).json({ message: 'Authentication error' });
		}
	} else {
		// TODO: Redirect
		res.status(HTTPStatusCode.Unauthorized).json({ message: 'request\'s Authentication header is empty' });
	}
};
