import { Hono } from 'hono';
import { formatHumanDate } from '../index.js';
import { parseNaturalDate } from '../natural-parser.js';

const subtract = new Hono();

subtract.get('/:date/:amount/:unit', (c) => {
	try {
		const baseDate = parseNaturalDate(c.req.param('date'));
		const amount = parseInt(c.req.param('amount'));
		const unit = c.req.param('unit').toLowerCase();

		if (isNaN(amount)) throw new Error('Invalid amount');

		const resultDate = new Date(baseDate);

		switch (unit) {
			case 'day':
			case 'days':
				resultDate.setDate(resultDate.getDate() - amount);
				break;
			case 'week':
			case 'weeks':
				resultDate.setDate(resultDate.getDate() - amount * 7);
				break;
			case 'month':
			case 'months':
				resultDate.setMonth(resultDate.getMonth() - amount);
				break;
			case 'year':
			case 'years':
				resultDate.setFullYear(resultDate.getFullYear() - amount);
				break;
			default:
				throw new Error(`Unknown unit: ${unit}`);
		}

		return c.json({
			base: baseDate.toISOString().split('T')[0],
			result: resultDate.toISOString().split('T')[0],
			formatted: formatHumanDate(resultDate),
			operation: `-${amount} ${unit}`
		});
	} catch (error) {
		return c.json({ error: error instanceof Error ? error.message : 'Invalid input' }, 400);
	}
});

export default subtract;
