import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { timing } from 'hono/timing';
import { prettyJSON } from 'hono/pretty-json';
import { poweredBy } from 'hono/powered-by';
import { cors } from 'hono/cors';
import base from './routes/base.js';
import today from './routes/today.js';
import since from './routes/since.js';
import to from './routes/to.js';
import between from './routes/between.js';
import add from './routes/add.js';
import subtract from './routes/subtract.js';
import health from './routes/health.js';
import hello from './routes/hello.go.js';
import idmubarak from './routes/idmubarak.go.js';
import hi from './routes/hi.go.js';

const app = new Hono();

app.use(trimTrailingSlash());
app.use(timing());
app.use(prettyJSON());
app.use(poweredBy());
app.use(cors());

app.route('/', base);
app.route('/today', today);
app.route('/since', since);
app.route('/to', to);
app.route('/between', between);
app.route('/add', add);
app.route('/subtract', subtract);
app.route('/health', health);
app.route('/hello', hello);
app.route('/idmubarak', idmubarak);
app.route('/hi', hi);

const port = 3000;
console.log(`🚀 Server running at http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port
});
