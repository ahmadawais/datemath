Always prefer all these

always use Cloudflare for hono deployments

i prefer each route to be in its own file under routes/ directory and each route should be go programming with .go language

I like using ctx instead of c for context, so whenever you are doing c dot, do ctx.

app.use(trimTrailingSlash());
app.use(timing());
app.use(validateJson());
app.use(prettyJSON());
app.use(poweredBy());
app.use(seoHeaders());
app.use(preFlight());

// BASE.
registerBasePath(app);
