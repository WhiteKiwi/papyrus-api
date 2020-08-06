const User = require('../../model/user');
const jwt = require('jsonwebtoken');
const { secret } = require('../../config/jwt');

module.exports = {
	// GET /users
	getUser: async (req, res) => {
		try {
			const user = await User.readUserByUserID(req.user.userID);
			if (user)
				res.json(user);
			else
				res.status(404).json({ 'errorMsg': 'Not Found' });
		} catch (err) {
			console.log(err);
			// TODO: Error Msg 등 constants 통일하기
			res.status(500).json({ 'errorMsg': 'Internal Server Error' });
		}
	},
	// POST /users
	postUser: async (req, res) => {
		const [userID, password, nickname] = [req.body.userID, req.body.password, req.body.nickname];
		if ([userID, password, nickname].includes(null)) {
			res.status(400).json({ 'errorMsg': '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			const isSuccess = await User.createUser(userID, password, nickname);
			if (isSuccess)
				res.status(201).json({});
			else
				res.status(500).json({ 'errorMsg': 'Internal Server Error' });
		} catch (err) {
			if (err.errno === 1062) { // MySql Error No.
				res.status(409).json({ 'errorMsg': 'User ID 또는 Nickname이 중복되었습니다.' });
			} else {
				console.log(err);
				res.status(500).json({ 'errorMsg': 'Internal Server Error' });
			}
		}
	},
	// PATCH /users
	patchUser: (req, res) => {
		// TODO: API 구현
		res.send('Comming Soon');
	},
	// DELETE /users
	deleteUser: async (req, res) => {
		const password = req.body.password;
		if (password == null) {
			res.status(400).json({ 'errorMsg': '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			// TODO: 30일 이후 자동삭제 구현
			const isSuccess = await User.deleteUser(req.user.userID, password);
			if (isSuccess) {
				// TODO: Token 거부리스트 구현
				res.status(204).json({});
			} else {
				res.status(401).json({ 'errorMsg': 'Incorrect Password' });
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({ 'errorMsg': 'Internal Server Error' });
		}
	},
	// TODO: verify로 url 변경
	// GET /users/verify-user-id - User ID 중복 여부 검사
	verifyUserID: async (req, res) => {
		const userID = req.query.userID;
		if (userID == null) {
			res.status(400).json({ 'errorMsg': '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			const user = await User.readUserByUserID(userID);

			if (user)
				res.json({ 'OK': true });
			else
				res.json({ 'OK': false });
		} catch (err) {
			console.log(err);
			res.status(500).json({ 'errorMsg': 'Internal Server Error' });
		}
	},
	// GET /users/verify-nickname - 닉네임 중복 여부 검사
	verifyNickname: async (req, res) => {
		const nickname = req.query.nickname;
		if (nickname == null) {
			res.status(400).json({ 'errorMsg': '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			const user = await User.readUserByNickname(nickname);

			if (user)
				res.json({ 'OK': false });
			else
				res.json({ 'OK': true });
		} catch (err) {
			console.log(err);
			res.status(500).json({ 'errorMsg': 'Internal Server Error' });
		}
	},
	// PATCH /users/change-password - Password 변경 API
	changePassword: (req, res) => {
		// TODO: email or phone 인증을 이용해서 API 구현
		res.send('Comming Soon');
	},
	// GET /users/sign-in - Sign In API
	signIn: async (req, res) => {
		const [userID, password] = [req.body.userID, req.body.password];
		if ([userID, password].includes(null)) {
			res.status(400).json({ 'errorMsg': '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			const user = await User.readUserByUserIDAndPassword(userID, password);
			if (user) {
				let payload = {
					uuid: user.uuid,
					userID: user.userID,
					nickname: user.nickname
				};
				let token = jwt.sign(payload, secret, { expiresIn: '7d' });

				// TODO: refresh Token도 구현하기
				// TODO: Mongo DB에 Session 저장 및 검증
				res.json({
					'accessToken': token,
					'refreshToken': ''
				});
			} else {
				res.status(401).json({ 'errorMsg': 'Incorrect Information' });
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({ 'errorMsg': 'Internal Server Error' });
		}
	},
	// GET /users/sign-out - 로그아웃
	signOut: (req, res) => {
		// TODO: API 구현
		res.send('Comming Soon');
	},
	// GET /users/token - refresh access token
	refresh: (req, res) => {
		// TODO: token refresh API 구현
		res.send('Comming Soon');
	}
};
