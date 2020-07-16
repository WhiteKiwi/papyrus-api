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
