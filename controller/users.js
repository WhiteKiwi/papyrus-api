const users = require('../models/users');

module.exports = {
	// GET /users/?id= - user id에 해당하는 유저 정보 반환
	getUserInfo: function (req, res) {
		if (req.query.id) {
			users.getUser(req.query.id).then((user) => {
				if (user) {
					res.json(user);
				} else {
					res.status(404).json({ 'errorMsg': '존재하지 않는 유저입니다.' });
				}
			}).catch((err) => {
				console.log(err);
				throw err;
			});
		} else {
			res.status(400).json({ 'errorMsg': 'user id가 필요합니다.' });
		}
	},
	// POST /users/ - 유저 생성
	register: function (req, res) {
		let id = req.body.id;
		let password = req.body.password;
		let nickname = req.body.nickname;
		if (id != null && password != null && nickname != null) {
			// TODO: id 중복검사
			// TODO: password 암호화
			// TODO: nickname 중복검사
			users.addUser(id, password, nickname).then((user) => {
				res.send('User created successfully.');
			}).catch((err) => {
				console.log(err);
				throw err;
			});
		} else {
			res.status(400).json({ 'errorMsg': 'id, password 또는 nickname이 누락되었습니다.' });
		}
	},
	// PATCH /users/ - 유저 정보 업데이트 생성
	updateUserInfo: function (req, res) {
		// TODO: API 구현
		res.send("Comming Soon");
	},
	// DELETE /users/ - 유저 삭제
	withdrawal: function (req, res) {
		// TODO: API 구현
		res.send("Comming Soon");
	},
	// GET /users/validate-user-id
	validateUserID: function (req, res) {
		// TODO: API 구현
		res.send("Comming Soon");
	},
	// GET /users/validate-nickname
	validateNickname: function (req, res) {
		// TODO: API 구현
		res.send("Comming Soon");
	},
	// PATCH /users/change-password
	changePassword: function (req, res) {
		// TODO: email or phone 인증을 이용해서 API 구현
		res.send("Comming Soon");
	},
};