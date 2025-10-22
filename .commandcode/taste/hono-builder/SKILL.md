---
name: hono-builder
description: Build production-ready web applications and APIs with Hono, a fast, lightweight web framework built on Web Standards. Use when building REST APIs, full-stack applications, serverless functions, or any web application that needs to run across multiple JavaScript runtimes (Cloudflare Workers, Deno, Bun, Node.js, Vercel, AWS Lambda).
---

# Hono Builder

Build ultrafast, type-safe web applications with Hono - a lightweight framework that runs anywhere JavaScript does.

## When to Use This Skill

Use this skill when:
- Building REST APIs or web applications from scratch
- Creating serverless functions or edge applications
- Migrating from Express.js or other frameworks
- Building full-stack applications with type-safe RPC
- Working with Cloudflare Workers, Deno, Bun, or Node.js

## Quick Start

### Installation

```bash
# Create new project
npm create hono@latest my-app
# or
bun create hono@latest my-app

# Select runtime template when prompted:
# - cloudflare-workers
# - cloudflare-pages
# - nodejs
# - bun
# - deno
# - aws-lambda
# - vercel
# - nextjs (for Next.js API routes)
```

### Basic Application

```typescript
import { Hono } from 'hono'

const app = new Hono()

// Routes
app.get('/', (c) => c.text('Hello Hono!'))
app.get('/api/hello', (c) => c.json({ message: 'Hello!' }))

// Path parameters and queries
app.get('/posts/:id', (c) => {
  const id = c.req.param('id')
  const page = c.req.query('page')
  return c.json({ id, page })
})

// POST, PUT, DELETE
app.post('/posts', (c) => c.text('Created!', 201))
app.delete('/posts/:id', (c) => c.text('Deleted!'))

export default app
```

## Core Concepts

### Context Object (`c`)

The context object provides everything needed for request/response handling:

```typescript
app.get('/example', (c) => {
  // Request
  c.req.param('id')           // Path parameter
  c.req.query('page')          // Query string
  c.req.header('Authorization') // Header
  await c.req.json()           // JSON body
  await c.req.formData()       // Form data
  
  // Response
  return c.text('text')              // Text response
  return c.json({ data: 'json' })    // JSON response
  return c.html(<h1>Hello</h1>)      // HTML/JSX response
  return c.redirect('/other')        // Redirect
  
  // Set headers/status
  c.status(201)
  c.header('X-Custom', 'value')
  
  // Variables (shared across middleware/handlers)
  c.set('user', userData)
  const user = c.get('user')
  const user = c.var.user  // Alternative syntax
})
```

### Routing

```typescript
// Basic routes
app.get('/users', (c) => c.json({ users: [] }))
app.post('/users', (c) => c.json({ created: true }))

// Path parameters
app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id })
})

// Wildcard and optional parameters
app.get('/posts/*', (c) => c.text('Any post'))
app.get('/static/*', (c) => c.text('Static files'))

// Multiple methods
app.on(['GET', 'POST'], '/webhook', (c) => c.text('OK'))
app.all('/any-method', (c) => c.text('All methods'))

// Route groups with app.route()
const api = new Hono()
api.get('/users', (c) => c.json({ users: [] }))
api.get('/posts', (c) => c.json({ posts: [] }))

app.route('/api', api)  // Mounts at /api/users, /api/posts
```

### Type Safety with Generics

Define types for environment variables, context variables, and path parameters:

```typescript
type Env = {
  Variables: {
    user: { id: string; name: string }
    db: Database
  }
  Bindings: {
    DATABASE_URL: string
    API_KEY: string
  }
}

const app = new Hono<Env>()

app.use('*', async (c, next) => {
  // Access bindings (environment variables)
  const dbUrl = c.env.DATABASE_URL
  
  // Set typed variables
  c.set('user', { id: '1', name: 'John' })
  await next()
})

app.get('/profile', (c) => {
  const user = c.var.user  // Fully typed!
  return c.json(user)
})
```

## Middleware

### Built-in Middleware

```typescript
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { basicAuth } from 'hono/basic-auth'
import { bearerAuth } from 'hono/bearer-auth'
import { etag } from 'hono/etag'
import { serveStatic } from 'hono/cloudflare-workers'  // or /bun, /deno, etc.

const app = new Hono()

// Logger
app.use(logger())

// CORS
app.use('/api/*', cors({
  origin: 'https://example.com',
  credentials: true,
}))

// Authentication
app.use('/admin/*', basicAuth({
  username: 'admin',
  password: 'secret',
}))

app.use('/api/*', jwt({
  secret: 'my-secret-key',
}))

// Static files (adapter-specific)
app.use('/static/*', serveStatic({ root: './' }))
```

### Custom Middleware

```typescript
import { createMiddleware } from 'hono/factory'

// Simple middleware
const customLogger = createMiddleware(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
  console.log(`Status: ${c.res.status}`)
})

// Typed middleware with variables
type Env = {
  Variables: {
    requestId: string
  }
}

const requestId = createMiddleware<Env>(async (c, next) => {
  c.set('requestId', crypto.randomUUID())
  await next()
})

app.use(requestId)
app.use(customLogger)

// Apply middleware to specific routes
app.use('/api/*', customLogger)
app.get('/api/data', (c) => {
  const id = c.var.requestId
  return c.json({ requestId: id })
})
```

## Validation with Zod

Install Zod validator:

```bash
npm install zod @hono/zod-validator
```

### Basic Validation

```typescript
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().min(18).optional(),
})

app.post(
  '/users',
  zValidator('json', userSchema),
  (c) => {
    const data = c.req.valid('json')  // Fully typed!
    return c.json({ 
      success: true,
      user: data  // { name: string, email: string, age?: number }
    })
  }
)
```

### Custom Error Handling

```typescript
app.post(
  '/users',
  zValidator('json', userSchema, (result, c) => {
    if (!result.success) {
      return c.json({
        success: false,
        errors: result.error.errors
      }, 400)
    }
  }),
  (c) => {
    const data = c.req.valid('json')
    return c.json({ success: true, user: data })
  }
)
```

### Validation Targets

```typescript
// JSON body
zValidator('json', schema)

// Form data
zValidator('form', schema)

// Query parameters
zValidator('query', z.object({ page: z.string() }))

// Path parameters
zValidator('param', z.object({ id: z.string() }))

// Headers
zValidator('header', z.object({ 
  'authorization': z.string()
}))

// Cookies
zValidator('cookie', schema)
```

### Wrapper for Consistent Error Handling

```typescript
import { zValidator as zv } from '@hono/zod-validator'
import { HTTPException } from 'hono/http-exception'

export const zValidator = <T extends z.ZodSchema, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T
) => zv(target, schema, (result, c) => {
  if (!result.success) {
    throw new HTTPException(400, { 
      message: 'Validation failed',
      cause: result.error 
    })
  }
})
```

## Type-Safe RPC

Hono's RPC feature enables end-to-end type safety between server and client without code generation.

### Server Setup

```typescript
// server.ts
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
})

// Create typed route variable
const route = app
  .post('/api/users', zValidator('json', userSchema), (c) => {
    const user = c.req.valid('json')
    return c.json({ 
      id: '123',
      ...user 
    }, 201)
  })
  .get('/api/users/:id', (c) => {
    const id = c.req.param('id')
    return c.json({ 
      id, 
      name: 'John', 
      age: 30 
    })
  })

// Export the type
export type AppType = typeof route
export default app
```

### Client Setup

```typescript
// client.ts
import { hc } from 'hono/client'
import type { AppType } from './server'

const client = hc<AppType>('http://localhost:3000')

// Fully type-safe API calls!
const res = await client.api.users.$post({
  json: {
    name: 'John',
    age: 30
  }
})

if (res.ok) {
  const data = await res.json()
  console.log(data.id)  // Typed: string
  console.log(data.name) // Typed: string
}

// GET request
const userRes = await client.api.users[':id'].$get({
  param: { id: '123' }
})

const userData = await userRes.json()
console.log(userData.name) // Typed!
```

### RPC with React Query

```typescript
import { useMutation, useQuery } from '@tanstack/react-query'
import { hc, InferRequestType, InferResponseType } from 'hono/client'
import type { AppType } from './server'

const client = hc<AppType>('/api')

// Infer types
type CreateUserRequest = InferRequestType<typeof client.api.users.$post>
type CreateUserResponse = InferResponseType<typeof client.api.users.$post>

export function useCreateUser() {
  return useMutation<CreateUserResponse, Error, CreateUserRequest['json']>({
    mutationFn: async (json) => {
      const res = await client.api.users.$post({ json })
      return await res.json()
    }
  })
}

// Usage in component
function CreateUserForm() {
  const mutation = useCreateUser()
  
  const handleSubmit = (data) => {
    mutation.mutate({ name: data.name, age: data.age })
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

### Monorepo Setup with RPC

For monorepos, use TypeScript project references to share types between packages:

```json
// packages/frontend/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true
  },
  "references": [
    { "path": "../backend" }
  ]
}

// packages/backend/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true
  }
}
```

## Error Handling

### Global Error Handler

```typescript
import { HTTPException } from 'hono/http-exception'

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({
      error: err.message
    }, err.status)
  }
  
  if (err instanceof z.ZodError) {
    return c.json({
      error: 'Validation failed',
      details: err.errors
    }, 400)
  }
  
  console.error('Unexpected error:', err)
  return c.json({
    error: 'Internal server error'
  }, 500)
})
```

### Throwing Errors

```typescript
import { HTTPException } from 'hono/http-exception'

app.get('/users/:id', async (c) => {
  const id = c.req.param('id')
  const user = await db.findUser(id)
  
  if (!user) {
    throw new HTTPException(404, { 
      message: 'User not found' 
    })
  }
  
  return c.json(user)
})
```

### Custom Error Class

```typescript
class AuthError extends HTTPException {
  constructor(message: string) {
    super(401, { message })
  }
}

app.get('/profile', (c) => {
  const token = c.req.header('Authorization')
  if (!token) {
    throw new AuthError('Missing authorization token')
  }
  // ...
})
```

## JSX and Server-Side Rendering

```typescript
// Enable JSX in tsconfig.json:
// "jsx": "react-jsx",
// "jsxImportSource": "hono/jsx"

import { Hono } from 'hono'
import type { FC } from 'hono/jsx'

const app = new Hono()

const Layout: FC = ({ children }) => {
  return (
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <header>My Header</header>
        <main>{children}</main>
      </body>
    </html>
  )
}

app.get('/page', (c) => {
  return c.html(
    <Layout>
      <h1>Hello from Hono!</h1>
      <p>Server-rendered JSX</p>
    </Layout>
  )
})

// With renderer middleware
app.use('*', async (c, next) => {
  c.setRenderer((content) => {
    return c.html(
      <Layout>{content}</Layout>
    )
  })
  await next()
})

app.get('/page', (c) => {
  return c.render(
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  )
})
```

## Testing

```typescript
import { describe, it, expect } from 'vitest'
import { testClient } from 'hono/testing'
import app from './app'

describe('API Tests', () => {
  it('should return hello message', async () => {
    const client = testClient(app)
    
    const res = await client.api.hello.$get()
    
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.message).toBe('Hello!')
  })
  
  it('should create user', async () => {
    const client = testClient(app)
    
    const res = await client.api.users.$post({
      json: {
        name: 'John',
        age: 30
      }
    })
    
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.name).toBe('John')
  })
})
```

## Runtime-Specific Features

### Cloudflare Workers

```typescript
import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  BUCKET: R2Bucket
  KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/data', async (c) => {
  // D1 Database
  const result = await c.env.DB
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind('123')
    .first()
  
  // KV
  const value = await c.env.KV.get('key')
  
  // R2
  const object = await c.env.BUCKET.get('file.txt')
  
  return c.json({ result, value })
})

export default app
```

### Node.js with Adapters

```typescript
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Node.js!'))

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server running at http://localhost:${info.port}`)
})
```

### Bun

```typescript
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Bun!'))

export default {
  port: 3000,
  fetch: app.fetch,
}
```

## Best Practices

### 1. Write Handlers Inline for Type Inference

```typescript
// ✅ Good - path params are inferred
app.get('/users/:id', (c) => {
  const id = c.req.param('id')  // Inferred as string
  return c.json({ id })
})

// ❌ Avoid - path params not inferred
const getUser = (c: Context) => {
  const id = c.req.param('id')  // Not inferred
  return c.json({ id })
}
app.get('/users/:id', getUser)
```

For reusable handlers, use `createFactory`:

```typescript
import { createFactory } from 'hono/factory'

const factory = createFactory()

const handlers = factory.createHandlers(
  logger(),
  async (c) => {
    const id = c.req.param('id')  // Fully typed!
    return c.json({ id })
  }
)

app.get('/users/:id', ...handlers)
```

### 2. Organize Large Applications

```typescript
// users.ts
import { Hono } from 'hono'

const users = new Hono()
  .get('/', (c) => c.json({ users: [] }))
  .post('/', (c) => c.json({ created: true }))
  .get('/:id', (c) => c.json({ id: c.req.param('id') }))

export default users
export type UsersType = typeof users

// posts.ts
import { Hono } from 'hono'

const posts = new Hono()
  .get('/', (c) => c.json({ posts: [] }))
  .post('/', (c) => c.json({ created: true }))

export default posts

// index.ts
import { Hono } from 'hono'
import users from './users'
import posts from './posts'

const app = new Hono()
  .route('/users', users)
  .route('/posts', posts)

export default app
```

### 3. Context Sharing Between Middleware and Handlers

```typescript
type Env = {
  Variables: {
    db: Database
    user: User | null
  }
}

const app = new Hono<Env>()

// Middleware sets context
app.use('*', async (c, next) => {
  const db = await getDatabase()
  c.set('db', db)
  await next()
})

app.use('/api/*', async (c, next) => {
  const token = c.req.header('Authorization')
  const user = token ? await verifyToken(token) : null
  c.set('user', user)
  await next()
})

// Handlers use context
app.get('/api/profile', (c) => {
  const user = c.var.user  // Typed!
  if (!user) {
    throw new HTTPException(401)
  }
  return c.json(user)
})
```

### 4. Streaming Responses

```typescript
app.get('/stream', (c) => {
  return c.stream(async (stream) => {
    for (let i = 0; i < 10; i++) {
      await stream.write(`data: ${i}\n\n`)
      await stream.sleep(1000)
    }
  })
})
```

### 5. File Uploads

```typescript
app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file']
  
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer()
    // Process file...
    return c.json({ 
      name: file.name,
      size: file.size,
      type: file.type
    })
  }
  
  return c.json({ error: 'No file provided' }, 400)
})
```

## Common Patterns

### Authentication Middleware

```typescript
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

type Env = {
  Variables: {
    user: { id: string; email: string }
  }
}

const authenticate = createMiddleware<Env>(async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw new HTTPException(401, { message: 'Missing token' })
  }
  
  const user = await verifyToken(token)
  if (!user) {
    throw new HTTPException(401, { message: 'Invalid token' })
  }
  
  c.set('user', user)
  await next()
})

// Use in routes
app.get('/protected', authenticate, (c) => {
  const user = c.var.user
  return c.json({ user })
})
```

### Pagination

```typescript
const paginationSchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
})

app.get(
  '/items',
  zValidator('query', paginationSchema),
  async (c) => {
    const { page, limit } = c.req.valid('query')
    const offset = (page - 1) * limit
    
    const items = await db.getItems({ offset, limit })
    const total = await db.countItems()
    
    return c.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  }
)
```

### Rate Limiting

```typescript
import { rateLimiter } from 'hono-rate-limiter'

app.use(
  '/api/*',
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-6',
    keyGenerator: (c) => c.req.header('x-forwarded-for') ?? 'unknown',
  })
)
```

## Deployment

### Cloudflare Workers

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

### Vercel

```bash
npm install -g vercel
vercel
```

### Node.js (with PM2)

```bash
npm install -g pm2
pm2 start dist/index.js --name api
pm2 save
```

## Key Differences from Express

1. **Built on Web Standards** - Uses native `Request`/`Response` objects
2. **Runtime Agnostic** - Same code runs on Cloudflare Workers, Deno, Bun, Node.js
3. **TypeScript First** - Full type inference without manual typing
4. **Smaller Bundle** - Under 14kB for the core
5. **Faster Router** - Uses RegExpRouter instead of linear matching
6. **RPC Feature** - Built-in type-safe client without code generation

## Resources

- Official docs: https://hono.dev/
- GitHub: https://github.com/honojs/hono
- Examples: https://hono.dev/examples
- Discord: https://discord.gg/hono
