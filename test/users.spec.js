const request = require('supertest');
const app = require('../app');
require('chai').should();

const testUser = {
	'user_id': 'testUserQwerQwer',
	'password': 'testPassword',
	'nickname': 'TestKiwi'
};

let accessToken;
// let refreshToken;

// TODO: Test DB 분리하기

describe('POST /users/', () => {
	it('회원가입', (done) => {
		request(app)
			.post('/users/')
			.send({
				user_id: testUser.user_id,
				password: testUser.password,
				nickname: testUser.nickname
			})
			.expect(201)
			.end((err, res) => {
				if (err)
					throw err;

				done();
			});
	});

	it('회원가입 - 이미 존재하는 User', (done) => {
		request(app)
			.post('/users/')
			.send({
				user_id: testUser.user_id,
				password: testUser.password,
				nickname: testUser.nickname
			})
			.expect(409)
			.end((err, res) => {
				if (err)
					throw err;

				done();
			});
	});
});

describe('GET /users/validate-user-id', () => {
	it('User ID 중복검사 - 존재 O', (done) => {
		request(app)
			.get(`/users/validate-user-id?user_id=${testUser.user_id}`)
			.expect(200)
			.end((err, res) => {
				if (err)
					throw err;

				res.body.isExist.should.be.equal(true);

				done();
			});
	});

	it('User ID 중복검사 - 존재 X', (done) => {
		request(app)
			.get(`/users/validate-user-id?user_id=${testUser.user_id + 'a'}`)
			.expect(200)
			.end((err, res) => {
				if (err)
					throw err;

				res.body.isExist.should.be.equal(false);

				done();
			});
	});
});

describe('GET /users/validate-nickname', () => {
	it('Nickname 중복검사 - 존재 O', (done) => {
		request(app)
			.get(`/users/validate-nickname?nickname=${testUser.nickname}`)
			.expect(200)
			.end((err, res) => {
				if (err)
					throw err;

				res.body.isExist.should.be.equal(true);

				done();
			});
	});

	it('Nickname 중복검사 - 존재 X', (done) => {
		request(app)
			.get(`/users/validate-nickname?nickname=${testUser.nickname + 'a'}`)
			.expect(200)
			.end((err, res) => {
				if (err)
					throw err;

				res.body.isExist.should.be.equal(false);

				done();
			});
	});
});

describe('POST /users/sign-in', () => {
	it('로그인', (done) => {
		request(app)
			.post('/users/sign-in')
			.send({
				user_id: testUser.user_id,
				password: testUser.password
			})
			.expect(200)
			.end((err, res) => {
				if (err)
					throw err;

				accessToken = res.body.accessToken;
				// refreshToken = res.body.refreshToken;

				done();
			});
	});
});

describe('GET /users/', () => {
	it('내 정보 가져오기', (done) => {
		request(app)
			.get('/users/')
			.expect(200)
			.set({ 'Authorization': `Bearer ${accessToken}` })
			.end((err, res) => {
				if (err)
					throw err;

				res.body.user_id.should.be.equal(testUser.user_id);
				res.body.nickname.should.be.equal(testUser.nickname);

				done();
			});
	});
});

describe('DELETE /users/', () => {
	it('회원탈퇴', (done) => {
		request(app)
			.delete('/users/')
			.set({ 'Authorization': `Bearer ${accessToken}` })
			.send({
				password: testUser.password
			})
			.expect(200)
			.end((err, res) => {
				if (err)
					throw err;

				done();
			});
	});
});
