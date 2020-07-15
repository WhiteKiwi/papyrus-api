const request = require('supertest');
const app = require('../app');
require('chai').should();

describe('GET /users/', () => {
	it('Get User By User ID', (done) => {
		request(app)
			.get(`/users/?id=jh145478`)
			.expect(200)
			.end((err, res) => {
				if (err)
					throw err;

				const testUser = {
					"id": 1,
					"user_id": "jh145478",
					"nickname": "Kiwi"
				};
				res.body.id.should.be.equal(testUser.id);
				res.body.user_id.should.be.equal(testUser.user_id);
				res.body.nickname.should.be.equal(testUser.nickname);

				done();
			});
	});
});
