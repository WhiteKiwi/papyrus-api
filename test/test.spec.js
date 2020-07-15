/*eslint no-unused-vars: ["error", { "args": "none" }]*/
/*global describe it*/

const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
	it('정상적인 요청, 200', (done) => {
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
