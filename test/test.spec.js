const request = require('supertest');
const app = require('../app');
require('chai').should();

describe('GET /', () => {
	it('Hello, world!', (done) => {
		request(app)
			.get('/')
			.expect(200)
			.end((err, res) => {
				if (err)
					done(err);
				else {
					// result Text must be 'Hello, world!'
					res.text.should.be.equal('Hello, world!');

					done();
				}
			});
	});
});
