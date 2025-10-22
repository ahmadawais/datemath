import { Hono } from 'hono';
import { daysBetween, weeksBetween, monthsBetween, yearsBetween, formatDuration } from '../index.js';
import { parseNaturalDate } from '../natural-parser.js';

const between = new Hono();

between.get('/:date1/:date2', (c) => {
	try {
		const firstDate = parseNaturalDate(c.req.param('date1'));
		const secondDate = parseNaturalDate(c.req.param('date2'));

		const [earlier, later] = firstDate < secondDate ? [firstDate, secondDate] : [secondDate, firstDate];

		const days = daysBetween(earlier, later);
		const weeks = weeksBetween(earlier, later);
		const months = monthsBetween(earlier, later);
		const years = yearsBetween(earlier, later);

		return c.json({
			from: earlier.toISOString().split('T')[0],
			to: later.toISOString().split('T')[0],
			days,
			weeks,
			months,
			years,
			formatted: formatDuration(days)
		});
	} catch (error) {
		return c.json({ error: error instanceof Error ? error.message : 'Invalid date' }, 400);
	}
});

export default between;
