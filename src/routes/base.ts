import { Hono } from 'hono';

const base = new Hono();

base.get('/', (c) => {
	return c.json({
		name: 'datemath-cli API',
		version: '1.0.0',
		endpoints: {
			health: '/health',
			today: '/today',
			since: '/since/:date',
			to: '/to/:date',
			between: '/between/:date1/:date2',
			add: '/add/:date/:amount/:unit',
			subtract: '/subtract/:date/:amount/:unit',
			hello: '/hello/:name'
		}
	});
});

export default base;
