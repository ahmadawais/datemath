import { Hono } from 'hono';

const hi = new Hono();

hi.get('/', (ctx) => {
	const name = ctx.req.query('name');
	if (!name) {
		return ctx.json({
			message: 'Hi there! Please provide a name query parameter.'
		});
	}
	return ctx.json({
		message: `Hi ${name}!`
	});
});

export default hi;
