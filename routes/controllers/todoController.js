const TODO = require('../../models/todo');

module.exports = {
	// GET /todos - 유저의 Todo 리스트 반환
	getTodos: function (req, res) {
		TODO.getTodos(req.user).then((rows) => {
			// TODO: 카테고리, 미해결 등 옵션 추가
			res.json(rows);
		}).catch((err) => { 
			console.log(err);
			throw err; 
		});
	},
	// GET /todos/:uuid - 상세정보 반환
	getTodoInfo: function (req, res) {
		// TODO: API 구현
		res.send('Comming Soon');
	},
	// POST /todos - Todo 추가
	addTodo: function (req, res) {
		// TODO: API 구현
		res.send('Comming Soon');
	},
	// PATCH /todos - 정보 Update
	updateTodo: function (req, res) {
		// TODO: API 구현
		res.send('Comming Soon');
	},
	// DELETE /todos - Todo 삭제
	deleteTodo: function (req, res) {
		// TODO: API 구현
		res.send('Comming Soon');
	}
};