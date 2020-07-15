const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
	it('Get All Todos', (done) => {
		request(app)
			.get('/')
			.expect(200)
			.end((err, res) => {
				if (err)
					throw err;
				done();
			});
	});
});
