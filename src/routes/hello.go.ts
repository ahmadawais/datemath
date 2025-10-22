import { Hono } from 'hono';

const hello = new Hono();

hello.get('/:name', (ctx) => {
	const name = ctx.req.param('name');
	return ctx.json({
		message: `Hello ${name}`
	});
});

export default hello;
