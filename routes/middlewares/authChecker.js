const jwt = require('jsonwebtoken');
const jwt_config = require('../../config/jwt');

module.exports = (req, res, next) => {
	if (req.headers.authorization) {
		const token = req.headers.authorization.split('Bearer ')[1];

		jwt.verify(token, jwt_config.secret, (err) => {
			if (err) {
				res.status(401).json({ 'errorMsg': 'Authentication error' });
			} else {
				next();
			}
		});
	} else {
		res.status(401).json({ 'errorMsg': 'request\'s Authentication header is empty' });
	}
};
