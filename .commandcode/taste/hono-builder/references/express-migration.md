# Migrating from Express to Hono

A practical guide for developers transitioning from Express.js to Hono.

## Table of Contents

- [Key Differences](#key-differences)
- [Basic Setup](#basic-setup)
- [Routing](#routing)
- [Middleware](#middleware)
- [Request Handling](#request-handling)
- [Response Methods](#response-methods)
- [Error Handling](#error-handling)
- [Static Files](#static-files)
- [Common Patterns](#common-patterns)

## Key Differences

### Philosophy

**Express:**
- Node.js-centric
- Callback-based with some async support
- Large middleware ecosystem
- Uses `req` and `res` parameters

**Hono:**
- Runtime-agnostic (works on Cloudflare Workers, Deno, Bun, Node.js)
- Async/await first
- Built on Web Standards (Request/Response)
- Uses single `c` (context) parameter
- Smaller, faster, with TypeScript-first design

### Web Standards vs Node.js APIs

```typescript
// Express (Node.js APIs)
app.get('/user', (req, res) => {
  res.json({ name: 'John' })
})

// Hono (Web Standards)
app.get('/user', (c) => {
  return c.json({ name: 'John' })
})
```

## Basic Setup

### Express

```javascript
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

### Hono (Node.js)

```typescript
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

// JSON/form parsing is built-in, no middleware needed

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server running on port ${info.port}`)
})
```

### Hono (Cloudflare Workers)

```typescript
import { Hono } from 'hono'

const app = new Hono()

// No server setup needed, just export
export default app
```

## Routing

### Basic Routes

```javascript
// Express
app.get('/users', (req, res) => {
  res.json({ users: [] })
})

app.post('/users', (req, res) => {
  const body = req.body
  res.status(201).json({ created: true })
})
```

```typescript
// Hono
app.get('/users', (c) => {
  return c.json({ users: [] })
})

app.post('/users', async (c) => {
  const body = await c.req.json()
  return c.json({ created: true }, 201)
})
```

### Route Parameters

```javascript
// Express
app.get('/users/:id', (req, res) => {
  const id = req.params.id
  res.json({ id })
})
```

```typescript
// Hono
app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id })
})
```

### Query Parameters

```javascript
// Express
app.get('/search', (req, res) => {
  const query = req.query.q
  const page = req.query.page
  res.json({ query, page })
})
```

```typescript
// Hono
app.get('/search', (c) => {
  const query = c.req.query('q')
  const page = c.req.query('page')
  return c.json({ query, page })
})
```

### Router Organization

```javascript
// Express
const userRouter = express.Router()
userRouter.get('/', (req, res) => res.json({ users: [] }))
userRouter.get('/:id', (req, res) => res.json({ id: req.params.id }))

app.use('/users', userRouter)
```

```typescript
// Hono
const users = new Hono()
users.get('/', (c) => c.json({ users: [] }))
users.get('/:id', (c) => c.json({ id: c.req.param('id') }))

app.route('/users', users)
```

## Middleware

### Application-level Middleware

```javascript
// Express
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})
```

```typescript
// Hono
app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.path}`)
  await next()
})
```

### Route-specific Middleware

```javascript
// Express
const authenticate = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  req.user = verifyToken(token)
  next()
}

app.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user })
})
```

```typescript
// Hono
import { createMiddleware } from 'hono/factory'

type Env = {
  Variables: {
    user: User
  }
}

const authenticate = createMiddleware<Env>(async (c, next) => {
  const token = c.req.header('authorization')
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const user = verifyToken(token)
  c.set('user', user)
  await next()
})

app.get('/profile', authenticate, (c) => {
  const user = c.var.user
  return c.json({ user })
})
```

### Built-in Middleware Comparison

| Express | Hono |
|---------|------|
| `express.json()` | Built-in (use `c.req.json()`) |
| `express.urlencoded()` | Built-in (use `c.req.parseBody()`) |
| `express.static()` | `serveStatic()` from runtime adapter |
| `cors()` package | `cors()` from `hono/cors` |
| `morgan` | `logger()` from `hono/logger` |
| `helmet` | `secureHeaders()` from `hono/secure-headers` |

## Request Handling

### Request Body

```javascript
// Express
app.post('/users', (req, res) => {
  const body = req.body  // Requires express.json() middleware
  res.json(body)
})
```

```typescript
// Hono
app.post('/users', async (c) => {
  const body = await c.req.json()  // No middleware needed
  return c.json(body)
})
```

### Headers

```javascript
// Express
app.get('/data', (req, res) => {
  const auth = req.headers.authorization
  const userAgent = req.get('User-Agent')
  
  res.set('X-Custom', 'value')
  res.json({ auth })
})
```

```typescript
// Hono
app.get('/data', (c) => {
  const auth = c.req.header('authorization')
  const userAgent = c.req.header('user-agent')
  
  c.header('X-Custom', 'value')
  return c.json({ auth })
})
```

### Cookies

```javascript
// Express (requires cookie-parser)
const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.get('/', (req, res) => {
  const session = req.cookies.session
  res.cookie('visited', 'true')
  res.json({ session })
})
```

```typescript
// Hono
import { getCookie, setCookie } from 'hono/cookie'

app.get('/', (c) => {
  const session = getCookie(c, 'session')
  setCookie(c, 'visited', 'true')
  return c.json({ session })
})
```

## Response Methods

### JSON Response

```javascript
// Express
res.json({ data: 'value' })
res.status(201).json({ created: true })
```

```typescript
// Hono
return c.json({ data: 'value' })
return c.json({ created: true }, 201)
```

### Text Response

```javascript
// Express
res.send('Hello')
res.status(404).send('Not Found')
```

```typescript
// Hono
return c.text('Hello')
return c.text('Not Found', 404)
```

### HTML Response

```javascript
// Express
res.send('<h1>Hello</h1>')
```

```typescript
// Hono
return c.html('<h1>Hello</h1>')
// Or with JSX
return c.html(<h1>Hello</h1>)
```

### Redirect

```javascript
// Express
res.redirect('/new-location')
res.redirect(301, '/permanent-location')
```

```typescript
// Hono
return c.redirect('/new-location')
return c.redirect('/permanent-location', 301)
```

### Status Code

```javascript
// Express
res.status(404).json({ error: 'Not Found' })
res.sendStatus(204)
```

```typescript
// Hono
return c.json({ error: 'Not Found' }, 404)
return c.body(null, 204)
```

## Error Handling

### Express

```javascript
// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    error: err.message
  })
})

// Throwing errors
app.get('/error', (req, res, next) => {
  const err = new Error('Something went wrong')
  err.status = 400
  next(err)
})
```

### Hono

```typescript
import { HTTPException } from 'hono/http-exception'

// Error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status)
  }
  console.error(err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

// Throwing errors
app.get('/error', (c) => {
  throw new HTTPException(400, { 
    message: 'Something went wrong' 
  })
})
```

## Static Files

### Express

```javascript
app.use(express.static('public'))
app.use('/assets', express.static('assets'))
```

### Hono

```typescript
// Runtime-specific import
import { serveStatic } from 'hono/cloudflare-workers'
// or 'hono/bun', 'hono/deno', '@hono/node-server/serve-static'

app.use('/static/*', serveStatic({ root: './' }))
app.get('/assets/*', serveStatic({ root: './assets' }))
```

## Common Patterns

### Authentication Middleware

```javascript
// Express
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'No token' })
  }
  
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

```typescript
// Hono
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

type Env = {
  Variables: {
    user: JWTPayload
  }
}

const authenticate = createMiddleware<Env>(async (c, next) => {
  const token = c.req.header('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw new HTTPException(401, { message: 'No token' })
  }
  
  try {
    const user = await verifyToken(token)
    c.set('user', user)
    await next()
  } catch (error) {
    throw new HTTPException(401, { message: 'Invalid token' })
  }
})
```

### Validation Middleware

```javascript
// Express with express-validator
const { body, validationResult } = require('express-validator')

app.post(
  '/users',
  body('email').isEmail(),
  body('age').isInt({ min: 18 }),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    res.json({ user: req.body })
  }
)
```

```typescript
// Hono with Zod
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
})

app.post(
  '/users',
  zValidator('json', userSchema),
  (c) => {
    const user = c.req.valid('json')  // Fully typed!
    return c.json({ user })
  }
)
```

### File Upload

```javascript
// Express with multer
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    filename: req.file.filename,
    size: req.file.size
  })
})
```

```typescript
// Hono
app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file']
  
  if (file instanceof File) {
    return c.json({
      filename: file.name,
      size: file.size
    })
  }
  
  return c.json({ error: 'No file' }, 400)
})
```

### CORS Configuration

```javascript
// Express
const cors = require('cors')

app.use(cors({
  origin: 'https://example.com',
  credentials: true,
  methods: ['GET', 'POST'],
}))
```

```typescript
// Hono
import { cors } from 'hono/cors'

app.use('*', cors({
  origin: 'https://example.com',
  credentials: true,
  allowMethods: ['GET', 'POST'],
}))
```

### Rate Limiting

```javascript
// Express with express-rate-limit
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

app.use('/api/', limiter)
```

```typescript
// Hono with hono-rate-limiter
import { rateLimiter } from 'hono-rate-limiter'

app.use(
  '/api/*',
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    keyGenerator: (c) => c.req.header('x-forwarded-for') ?? 'unknown'
  })
)
```

## TypeScript Benefits

### Type Inference

```typescript
// Express - manual typing needed
app.get('/users/:id', (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id  // string
  res.json({ id })
})

// Hono - automatic type inference
app.get('/users/:id', (c) => {
  const id = c.req.param('id')  // string (inferred!)
  return c.json({ id })
})
```

### Environment Variables

```typescript
// Hono with typed environment
type Env = {
  Bindings: {
    DATABASE_URL: string
    API_KEY: string
  }
}

const app = new Hono<Env>()

app.get('/data', (c) => {
  const dbUrl = c.env.DATABASE_URL  // Fully typed!
  return c.text(dbUrl)
})
```

## Migration Checklist

- [ ] Replace `express` with `hono` package
- [ ] Replace `req, res` parameters with `c` (context)
- [ ] Change `res.json()` to `return c.json()`
- [ ] Change `req.params.x` to `c.req.param('x')`
- [ ] Change `req.query.x` to `c.req.query('x')`
- [ ] Change `req.body` to `await c.req.json()`
- [ ] Update middleware to use `async (c, next) => { await next() }`
- [ ] Replace `next(error)` with `throw new HTTPException()`
- [ ] Update static file serving to runtime-specific adapter
- [ ] Replace validation middleware with Zod validators
- [ ] Update error handling to use `app.onError()`
- [ ] Convert callbacks to async/await
- [ ] Add TypeScript types for environment and variables
- [ ] Test all routes and middleware

## Performance Benefits

When migrating from Express to Hono, expect:

- **Faster routing** - Hono's RegExpRouter is significantly faster than Express
- **Smaller bundle** - Hono core is ~14kB vs Express ~200kB+
- **Lower memory usage** - No large middleware ecosystem loaded by default
- **Better cold starts** - Critical for serverless/edge deployments
- **Type safety** - Catch errors at compile time instead of runtime
