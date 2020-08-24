const Sentry = require('@sentry/node');
const TodoRepository = require('../../repositories/TodoRepository');
const { HTTP_STATUS_CODE } = require('../../utils/constants');

const todoRepository = new TodoRepository();
module.exports = {
	// GET /todos
	getTodos: async (req, res) => {
		try {
			const todos = await todoRepository.readAll(req.user.uuid);
			// TODO: 카테고리, 미해결 등 옵션 추가
			res.json(todos);
		} catch (e) {
			Sentry.captureException(e);
			res.status(HTTP_STATUS_CODE.InternalServerError).json({ message: 'Internal Server Error' });
		}
	},
	// GET /todos/:uuid
	getTodo: async (req, res) => {
		const todoUUID = req.params.uuid;
		if (todoUUID == null) {
			res.status(HTTP_STATUS_CODE.BadRequest).json({ message: '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			const todo = await todoRepository.read(req.user.uuid, todoUUID);
			if (todo)
				res.json(todo);
			else
				res.status(HTTP_STATUS_CODE.NotFound).json({ message: 'Not Found' });
		} catch (e) {
			Sentry.captureException(e);
			res.status(HTTP_STATUS_CODE.InternalServerError).json({ message: 'Internal Server Error' });
		}
	},
	// POST /todos
	postTodo: async (req, res) => {
		const title = req.body.title;
		if (title == null) {
			res.status(HTTP_STATUS_CODE.BadRequest).json({ message: '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			const isSuccess = await todoRepository.create(req.user.uuid, title);
			if (isSuccess)
				res.status(HTTP_STATUS_CODE.Created).json({});
			else
				res.status(HTTP_STATUS_CODE.BadRequest).json({ message: 'Bad Request' });
		} catch (e) {
			Sentry.captureException(e);
			res.status(HTTP_STATUS_CODE.InternalServerError).json({ message: 'Internal Server Error' });
		}
	},
	// PATCH /todos/:uuid
	patchTodo: async (req, res) => {
		const [todo, todoUUID] = [req.body, req.params.uuid];
		if ([todo, todoUUID].includes(undefined)) {
			res.status(HTTP_STATUS_CODE.BadRequest).json({ message: '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			todo.uuid = todoUUID;
			const isSuccess = await todoRepository.update(req.user.uuid, todo);
			if (isSuccess)
				res.status(HTTP_STATUS_CODE.NoContent).json({});
			else
				res.status(HTTP_STATUS_CODE.BadRequest).json({ message: 'Bad Request' });
		} catch (e) {
			Sentry.captureException(e);
			res.status(HTTP_STATUS_CODE.InternalServerError).json({ message: 'Internal Server Error' });
		}
	},
	// DELETE /todos/:uuid
	deleteTodo: async (req, res) => {
		const todoUUID = req.params.uuid;
		if (todoUUID == null) {
			res.status(HTTP_STATUS_CODE.BadRequest).json({ message: '필요한 정보가 누락되었습니다.' });
			return;
		}

		try {
			// TODO: SOFT DELETE 구현
			const isSuccess = await todoRepository.delete(req.user.uuid, todoUUID);
			if (isSuccess) {
				res.status(HTTP_STATUS_CODE.NoContent).json({});
			} else {
				// 값이 존재하지 않는 요청은 400? 404? => 요청이 잘못됨 - 400
				res.status(HTTP_STATUS_CODE.BadRequest).json({ message: 'Bad Request' });
			}
		} catch (e) {
			Sentry.captureException(e);
			res.status(HTTP_STATUS_CODE.InternalServerError).json({ message: 'Internal Server Error' });
		}
	}
};
