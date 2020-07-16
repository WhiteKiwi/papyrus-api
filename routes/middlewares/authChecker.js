const jwt = require('jsonwebtoken');
const jwt_config = require('../../config/jwt');

// authChecker - jwt token 인증 후 payload에서 user 정보를 뽑아서 req.user에 담아줌
module.exports = (req, res, next) => {
	if (req.headers.authorization) {
		const token = req.headers.authorization.split('Bearer ')[1];

		let user = jwt.verify(token, jwt_config.secret);
		if (user) {
			req.user = {
				id: user.id,
				user_id: user.user_id,
				nickname: user.nickname
			};
			next();
		} else {
			res.status(401).json({ 'errorMsg': 'Authentication error' });
		}
	} else {
		res.status(401).json({ 'errorMsg': 'request\'s Authentication header is empty' });
	}
};
