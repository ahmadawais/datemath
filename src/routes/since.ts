import { Hono } from 'hono';
import { daysBetween, weeksBetween, formatDuration } from '../index.js';
import { parseNaturalDate } from '../natural-parser.js';

const since = new Hono();

since.get('/:date', (c) => {
	try {
		const targetDate = parseNaturalDate(c.req.param('date'));
		const today = new Date();
		const days = daysBetween(targetDate, today);
		const weeks = weeksBetween(targetDate, today);

		return c.json({
			from: targetDate.toISOString().split('T')[0],
			to: today.toISOString().split('T')[0],
			days,
			weeks,
			formatted: formatDuration(days)
		});
	} catch (error) {
		return c.json({ error: error instanceof Error ? error.message : 'Invalid date' }, 400);
	}
});

export default since;
