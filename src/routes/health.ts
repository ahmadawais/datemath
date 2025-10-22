import { Hono } from 'hono';

const health = new Hono();

health.get('/', (c) => {
	return c.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		service: 'datemath-cli API'
	});
});

export default health;
