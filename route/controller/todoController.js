const Todo = require('../../model/todo');

module.exports = {
	// GET /todos
	getTodos: async (req, res) => {
		try {
			const todos = await Todo.readTodos(req.user.uuid);
			// TODO: 카테고리, 미해결 등 옵션 추가
			res.json(todos);
		} catch (err) {
			console.log(err);
			res.status(500).json({ 'errorMsg': 'Internal Server Error' });
		}
	},
	// GET /todos/:uuid
	getTodo: async (req, res) => {
		const todoUUID = req.params.uuid;
		if (todoUUID == null) {
			res.status(400).json({ 'errorMsg': '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			const todo = await Todo.readTodo(req.user.uuid, todoUUID);
			if (todo)
				res.json(todo);
			else
				res.status(404).json({ 'errorMsg': 'Not Found' });
		} catch (err) {
			console.log(err);
			res.status(500).json({ 'errorMsg': 'Internal Server Error' });
		}
	},
	// POST /todos
	postTodo: async (req, res) => {
		const title = req.body.title;
		if (title == null) {
			res.status(400).json({ 'errorMsg': '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			const isSuccess = await Todo.createTodo(req.user.uuid, title);
			if (isSuccess)
				res.status(201).json({});
			else
				res.status(400).json({ 'errorMsg': 'Bad Request' });
		} catch (err) {
			console.log(err);
			res.status(500).json({ 'errorMsg': 'Internal Server Error' });
		}
	},
	// PATCH /todos/:uuid
	patchTodo: async (req, res) => {
		const [todo, todoUUID] = [req.body, req.params.uuid];
		if ([todo, todoUUID].includes(null)) {
			res.status(400).json({ 'errorMsg': '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			todo.uuid = todoUUID;
			const isSuccess = await Todo.updateTodo(req.user.uuid, todo);
			if (isSuccess)
				res.status(204).json({});
			else
				res.status(400).json({ 'errorMsg': 'Bad Request' });
		} catch (err) {
			console.log(err);
			res.status(500).json({ 'errorMsg': 'Internal Server Error' });
		}
	},
	// DELETE /todos/:uuid
	deleteTodo: async (req, res) => {
		const todoUUID = req.params.uuid;
		if (todoUUID == null) {
			res.status(400).json({ 'errorMsg': '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			// TODO: SOFT DELETE 구현
			const isSuccess = await Todo.deleteTodo(req.user.uuid, todoUUID);
			if (isSuccess) {
				res.status(204).json({});
			} else {
				// 값이 존재하지 않는 요청은 400? 404? => 요청이 잘못됨 - 400
				res.status(400).json({ 'errorMsg': 'Bad Request' });
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({ 'errorMsg': 'Internal Server Error' });
		}
	}
};
