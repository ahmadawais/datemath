import { Hono } from 'hono';

const idmubarak = new Hono();

idmubarak.get('/', (ctx) => {
	const name = ctx.req.query('name');
	if (!name) {
		return ctx.json({
			error: 'Name query parameter is required'
		}, 400);
	}
	return ctx.json({
		message: `Id Mubarak ${name}`
	});
});

export default idmubarak;
