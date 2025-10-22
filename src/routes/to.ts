import { Hono } from 'hono';
import { daysBetween, weeksBetween, formatDuration } from '../index.js';
import { parseNaturalDate } from '../natural-parser.js';

const to = new Hono();

to.get('/:date', (c) => {
	try {
		const targetDate = parseNaturalDate(c.req.param('date'));
		const today = new Date();
		const days = daysBetween(today, targetDate);
		const weeks = weeksBetween(today, targetDate);

		return c.json({
			from: today.toISOString().split('T')[0],
			to: targetDate.toISOString().split('T')[0],
			days,
			weeks,
			formatted: formatDuration(days),
			isPast: targetDate < today
		});
	} catch (error) {
		return c.json({ error: error instanceof Error ? error.message : 'Invalid date' }, 400);
	}
});

export default to;
