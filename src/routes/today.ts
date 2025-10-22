import { Hono } from 'hono';
import { formatHumanDate } from '../index.js';

const today = new Hono();

today.get('/', (c) => {
	const date = new Date();
	return c.json({
		date: date.toISOString().split('T')[0],
		formatted: formatHumanDate(date),
		timestamp: date.getTime()
	});
});

export default today;
