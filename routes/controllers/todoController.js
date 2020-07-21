const TODO = require('../../models/todo');

module.exports = {
	// GET /todos - 유저의 Todo 리스트 반환
	getTodos: function (req, res) {
		TODO.getTodos(req.user.uuid).then((rows) => {
			// TODO: 카테고리, 미해결 등 옵션 추가
			res.json(rows);
		}).catch((err) => { 
			console.log(err);
			throw err; 
		});
	},
	// GET /todos/:uuid - 상세정보 반환
	getTodoInfo: function (req, res) {
		TODO.getTodo(req.user.uuid, req.params.uuid).then((todo) => {
			if (todo) {
				res.json(todo);
			} else {
				res.status(404).json({ 'errorMsg': '존재하지 않는 Todo 입니다.' });
			}
		}).catch((err) => { 
			console.log(err);
			throw err; 
		});
	},
	// POST /todos - Todo 추가
	addTodo: function (req, res) {
		let title = req.body.title;
		if (title != '') {
			TODO.addTodo(req.user.uuid, title).then(() => {
				res.status(201).json({});
			}).catch((err) => {
				console.log(err);
				res.status(500).json({ 'errorMsg': 'Internal Server Error' });
			});
		} else {
			res.status(400).json({ 'errorMsg': '필요한 정보가 누락되었습니다.' });
		}
	},
	// PATCH /todos/:uuid - 정보 Update
	updateTodo: function (req, res) {
		let todo = req.body;
		if (Object.keys(todo).length != 0) {
			todo.uuid = req.params.uuid;
			TODO.updateTodo(req.user.uuid, todo).then(() => {
				res.status(204).json({});
			}).catch((err) => {
				// TODO: add custom error
				if (err.httpStatusCode) {
					res.status(err.httpStatusCode).json({ 'errorMsg': err.message });
				} else {
					console.log(err);
					res.status(500).json({ 'errorMsg': 'Internal Server Error' });
				}
			});
		} else {
			res.status(400).json({ 'errorMsg': '필요한 정보가 누락되었습니다.' });
		}
	},
	// DELETE /todos/:uuid - Todo 삭제
	deleteTodo: function (req, res) {
		TODO.deleteTodo(req.user.uuid, req.params.uuid).then(() => {
			// TODO: Token 거부리스트 구현
			res.status(204).json({});
		}).catch((err) => {
			if (err.httpStatusCode) {
				res.status(err.httpStatusCode).json({ 'errorMsg': err.message });
			} else {
				console.log(err);
				res.status(500).json({ 'errorMsg': 'Internal Server Error' });
			}
		});
	}
};