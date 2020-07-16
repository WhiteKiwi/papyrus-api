const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const jwt_config = require('../../config/jwt');

module.exports = {
	// GET /users/ - 유저 정보 반환
	getUserInfo: function (req, res) {
		User.getUser(req.user.user_id).then((user) => {
			if (user) {
				res.json(user);
			} else {
				res.status(404).json({ 'errorMsg': '존재하지 않는 유저입니다.' });
			}
		}).catch((err) => {
			console.log(err);
			throw err;
		});
	},
	// POST /users/ - 유저 생성
	signUp: function (req, res) {
		let id = req.body.user_id;
		let password = req.body.password;
		let nickname = req.body.nickname;
		if (id != null && password != null && nickname != null) {
			User.addUser(id, password, nickname).then(() => {
				res.status(201).send('User created successfully.');
			}).catch((err) => {
				if (err.errno == 1062)
					res.status(409).json({ 'errorMsg': 'User ID 또는 Nickname이 중복되었습니다.' });
				else
					res.status(500).json({ 'errorMsg': 'Internal Server Error' });
			});
		} else {
			res.status(400).json({ 'errorMsg': 'id, password 또는 nickname이 누락되었습니다.' });
		}
	},
	// PATCH /users/ - 유저 정보 업데이트 생성
	updateUserInfo: function (req, res) {
		// TODO: API 구현
		res.send('Comming Soon');
	},
	// DELETE /users/ - 유저 삭제
	withdrawal: function (req, res) {
		User.deleteUser(req.user.user_id, req.body.password).then(() => {
			res.send('User deleted successfully.');
		}).catch((err) => {
			console.log(err);
			throw err;
		});
	},
	// GET /users/validate-user-id
	validateUserID: function (req, res) {
		User.validateUserID(req.query.user_id).then((isExist) => {
			res.json({ 'isExist': isExist });
		}).catch((err) => {
			console.log(err);
			throw err;
		});
	},
	// GET /users/validate-nickname
	validateNickname: function (req, res) {
		User.validateNickname(req.query.nickname).then((isExist) => {
			res.json({ 'isExist': isExist });
		}).catch((err) => {
			console.log(err);
			throw err;
		});
	},
	// PATCH /users/change-password
	changePassword: function (req, res) {
		// TODO: email or phone 인증을 이용해서 API 구현
		res.send('Comming Soon');
	},
	// GET /users/sign-in
	signIn: function (req, res) {
		let user_id = req.body.user_id;
		let password = req.body.password;
		if (user_id != null && password != null) {
			User.validatePassword(user_id, password).then((user) => {
				if (user) {
					let payload = {
						id: user.id,
						user_id: user.user_id,
						nickname: user.nickname
					};
					let token = jwt.sign(payload, jwt_config.secret, { expiresIn: '7d' });

					// TODO: refresh Token도 구현하기
					res.json({
						'accessToken': token,
						'refreshToken': ''
					});
				} else {
					res.status(401).json({ 'errorMsg': '로그인에 실패하였습니다. Password를 확인해주세요.' });
				}
			}).catch((err) => {
				console.log(err);
				throw err;
			});
		}
	},
	// GET /users/sign-out
	signOut: function (req, res) {
		// TODO: API 구현
		res.send('Comming Soon');
	},
	refresh: function (req, res) {
		// TODO: token refresh API 구현
		res.send('Comming Soon');
	}
};