const request = require('supertest');
const app = require('../app');
require('chai').should();

let accessToken = ['', ''];
const testUser = [
	{
		'userID': 'testUserQwerQwer',
		'password': 'testPassword',
		'nickname': 'TestKiwi'
	},
	{
		'userID': 'testUserQwerQwer2',
		'password': 'testPassword',
		'nickname': 'TestKiwi2'
	}
];

const testTodos = {
	test1: {
		'title': 'test1',
		'isAchieved': false
	},
	test2: {
		'title': 'test2',
		'isAchieved': false
	},
	test3: {
		'title': 'test3',
		'isAchieved': false
	}
};

describe('테스트 계정 생성 및 로그인', () => {
	it('계정1 생성', (done) => {
		request(app)
			.post('/users')
			.send({
				userID: testUser[0].userID,
				password: testUser[0].password,
				nickname: testUser[0].nickname
			})
			.expect(201)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('계정2 생성', (done) => {
		request(app)
			.post('/users')
			.send({
				userID: testUser[1].userID,
				password: testUser[1].password,
				nickname: testUser[1].nickname
			})
			.expect(201)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('로그인1', (done) => {
		request(app)
			.post('/users/sign-in')
			.send({
				userID: testUser[0].userID,
				password: testUser[0].password
			})
			.expect(200)
			.end((e, res) => {
				if (e)
					done(e);
				else {
					accessToken[0] = res.body.accessToken;
					// refreshToken = res.body.refreshToken;

					done();
				}
			});
	});

	it('로그인2', (done) => {
		request(app)
			.post('/users/sign-in')
			.send({
				userID: testUser[1].userID,
				password: testUser[1].password
			})
			.expect(200)
			.end((e, res) => {
				if (e)
					done(e);
				else {
					accessToken[1] = res.body.accessToken;
					// refreshToken = res.body.refreshToken;

					done();
				}
			});
	});

	it('내 정보 가져오기', (done) => {
		request(app)
			.get('/users')
			.expect(200)
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.end((e, res) => {
				if (e)
					done(e);
				else {
					testUser[0].uuid = res.body.uuid;

					done();
				}
			});
	});

	it('내 정보 가져오기', (done) => {
		request(app)
			.get('/users')
			.expect(200)
			.set({ 'Authorization': `Bearer ${accessToken[1]}` })
			.end((e, res) => {
				if (e)
					done(e);
				else {
					testUser[1].uuid = res.body.uuid;

					done();
				}
			});
	});
});


describe('POST /todos', () => {
	it('Todo 추가 1', (done) => {
		request(app)
			.post('/todos')
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.send({
				title: testTodos['test1'].title
			})
			.expect(201)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('Todo 추가 2', (done) => {
		request(app)
			.post('/todos')
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.send({
				title: testTodos['test2'].title
			})
			.expect(201)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('Todo 추가 3', (done) => {
		request(app)
			.post('/todos')
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.send({
				title: testTodos['test3'].title
			})
			.expect(201)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});
});

describe('GET /todos', () => {
	it('Todo 리스트 가져오기', (done) => {
		request(app)
			.get('/todos')
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.expect(200)
			.end((e, res) => {
				if (e)
					done(e);
				else {
					res.body.length.should.be.equal(3);

					res.body.forEach((todo) => {
						testTodos[todo.title].isAchieved.should.be.equal(todo.isAchieved);
						testTodos[todo.title].uuid = todo.uuid;
						testTodos[todo.title].userUUID = testUser[0].uuid;
					});

					done();
				}
			});
	});
});

describe('GET /todos/:uuid', () => {
	it('Todo 상세정보 1', (done) => {
		request(app)
			.get(`/todos/${testTodos['test1'].uuid}`)
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.expect(200)
			.end((e, res) => {
				if (e)
					done(e);
				else {
					for (let key in res.body) {
						res.body[key].should.be.equal(testTodos['test1'][key]);
					}

					done();
				}
			});
	});

	it('Todo 상세정보 2', (done) => {
		request(app)
			.get(`/todos/${testTodos['test2'].uuid}`)
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.expect(200)
			.end((e, res) => {
				if (e)
					done(e);
				else {
					for (let key in res.body) {
						res.body[key].should.be.equal(testTodos['test2'][key]);
					}

					done();
				}
			});
	});

	it('Todo 상세정보 3', (done) => {
		request(app)
			.get(`/todos/${testTodos['test3'].uuid}`)
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.expect(200)
			.end((e, res) => {
				if (e)
					done(e);
				else {
					for (let key in res.body) {
						res.body[key].should.be.equal(testTodos['test3'][key]);
					}

					done();
				}
			});
	});

	it('Todo 상세정보 - 존재하지 않는 uuid', (done) => {
		request(app)
			.get('/todos/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.expect(404)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('Todo 상세정보 - 다른 유저의 Todo uuid', (done) => {
		request(app)
			.get(`/todos/${testTodos['test1'].uuid}`)
			.set({ 'Authorization': `Bearer ${accessToken[1]}` })
			.expect(404)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});
});

describe('PATCH /todos/:uuid', () => {
	it('Todo 수정 - 제목', (done) => {
		request(app)
			.patch(`/todos/${testTodos['test1'].uuid}`)
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.send({
				title: 'test1_edited'
			})
			.expect(204)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('Todo 수정 - 성취 여부', (done) => {
		request(app)
			.patch(`/todos/${testTodos['test2'].uuid}`)
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.send({
				isAchieved: true
			})
			.expect(204)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('Todo 수정 - 제목, 성취 여부', (done) => {
		request(app)
			.patch(`/todos/${testTodos['test3'].uuid}`)
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.send({
				title: 'test3_edited',
				isAchieved: true
			})
			.expect(204)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('Todo 수정 - 빈 요청', (done) => {
		request(app)
			.patch(`/todos/${testTodos['test3'].uuid}`)
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.send({})
			.expect(400)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('Todo 수정 - 잘못된 요청', (done) => {
		request(app)
			.patch(`/todos/${testTodos['test3'].uuid}`)
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.send({
				title2: 'test3_edited',
				isAchieved2: true
			})
			.expect(400)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('Todo 수정 - 존재하지 않는 uuid', (done) => {
		request(app)
			.patch('/todos/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.send({
				title: 'test3',
				isAchieved: false
			})
			.expect(400)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('Todo 수정 - 다른 유저의 Todo uuid', (done) => {
		request(app)
			.patch(`/todos/${testTodos['test3'].uuid}`)
			.set({ 'Authorization': `Bearer ${accessToken[1]}` })
			.send({
				title: 'test3',
				isAchieved: false
			})
			.expect(400)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});
});

describe('DELETE /todos/:uuid', () => {
	it('Todo 삭제', (done) => {
		request(app)
			.delete(`/todos/${testTodos['test1'].uuid}`)
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.expect(204)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('Todo 삭제 - 존재하지 않는 uuid', (done) => {
		request(app)
			.delete('/todos/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.expect(400)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('Todo 삭제 - 다른 유저의 Todo uuid', (done) => {
		request(app)
			.delete(`/todos/${testTodos['test2'].uuid}`)
			.set({ 'Authorization': `Bearer ${accessToken[1]}` })
			.expect(400)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});
});

describe('테스트 계정 삭제', () => {
	it('계정1 삭제', (done) => {
		request(app)
			.delete('/users')
			.set({ 'Authorization': `Bearer ${accessToken[0]}` })
			.send({
				password: testUser[0].password
			})
			.expect(204)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});

	it('계정2 삭제', (done) => {
		request(app)
			.delete('/users')
			.set({ 'Authorization': `Bearer ${accessToken[1]}` })
			.send({
				password: testUser[1].password
			})
			.expect(204)
			.end((e, res) => {
				if (e)
					done(e);
				else
					done();
			});
	});
});
