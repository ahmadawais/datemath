# Advanced Hono Patterns

This file contains advanced patterns, optimizations, and techniques for building production applications with Hono.

## Table of Contents

- [Performance Optimization](#performance-optimization)
- [OpenAPI Integration](#openapi-integration)
- [WebSocket Support](#websocket-support)
- [Database Integration Patterns](#database-integration-patterns)
- [Advanced RPC Patterns](#advanced-rpc-patterns)
- [Caching Strategies](#caching-strategies)
- [Observability](#observability)

## Performance Optimization

### Pre-compiling RPC Types

For large applications with slow TypeScript compilation, pre-compile RPC types:

```typescript
// lib/rpc-client.ts
import { app } from './app'
import { hc } from 'hono/client'

// Calculate type at compile time
export type Client = ReturnType<typeof hc<typeof app>>

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<typeof app>(...args)

// Usage
const client = hcWithType('http://localhost:3000')
```

### Lazy Loading Routes

For applications with many routes, use dynamic imports:

```typescript
const app = new Hono()

app.get('/heavy/*', async (c) => {
  const { heavyRoutes } = await import('./heavy-routes')
  return heavyRoutes.fetch(c.req.raw, c.env, c.executionCtx)
})
```

### Response Caching

```typescript
import { cache } from 'hono/cache'

app.get(
  '/api/data',
  cache({
    cacheName: 'api-cache',
    cacheControl: 'max-age=3600',
  }),
  async (c) => {
    const data = await expensiveOperation()
    return c.json(data)
  }
)
```

## OpenAPI Integration

### Using @hono/zod-openapi

```typescript
import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'

const app = new OpenAPIHono()

// Define schemas
const UserSchema = z
  .object({
    id: z.string().openapi({ example: '123' }),
    name: z.string().openapi({ example: 'John Doe' }),
    email: z.string().email().openapi({ example: '[email protected]' }),
  })
  .openapi('User')

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

const ErrorSchema = z
  .object({
    error: z.string(),
  })
  .openapi('Error')

// Define route
const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'User created successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Invalid request',
    },
  },
})

// Implement route
app.openapi(createUserRoute, async (c) => {
  const data = c.req.valid('json')
  const user = await createUser(data)
  return c.json(user, 201)
})

// Serve OpenAPI docs
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})

// Add Swagger UI
import { swaggerUI } from '@hono/swagger-ui'

app.get('/ui', swaggerUI({ url: '/doc' }))
```

### Custom OpenAPI Metadata

```typescript
const route = createRoute({
  method: 'get',
  path: '/users/{id}',
  tags: ['Users'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '123' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'User found',
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'User not found',
    },
  },
})

// Add security schemes
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
})
```

## WebSocket Support

### Cloudflare Workers

```typescript
import { upgradeWebSocket } from 'hono/cloudflare-workers'

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onOpen: (evt, ws) => {
        console.log('Connection opened')
      },
      onMessage: (event, ws) => {
        console.log(`Message: ${event.data}`)
        ws.send('Hello from server!')
      },
      onClose: (evt, ws) => {
        console.log('Connection closed')
      },
      onError: (evt, ws) => {
        console.log('Error:', evt)
      },
    }
  })
)
```

### Bun

```typescript
import { upgradeWebSocket } from 'hono/bun'

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        ws.send(event.data)
      },
    }
  })
)
```

### Deno

```typescript
import { upgradeWebSocket } from 'hono/deno'

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        ws.send(event.data)
      },
    }
  })
)
```

## Database Integration Patterns

### With Drizzle ORM

```typescript
import { drizzle } from 'drizzle-orm/d1'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { eq } from 'drizzle-orm'

// Schema
const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
})

type Env = {
  Bindings: {
    DB: D1Database
  }
  Variables: {
    db: ReturnType<typeof drizzle>
  }
}

const app = new Hono<Env>()

// Middleware to initialize Drizzle
app.use('*', async (c, next) => {
  const db = drizzle(c.env.DB)
  c.set('db', db)
  await next()
})

// Use in routes
app.get('/users', async (c) => {
  const db = c.var.db
  const allUsers = await db.select().from(users)
  return c.json(allUsers)
})

app.get('/users/:id', async (c) => {
  const db = c.var.db
  const id = parseInt(c.req.param('id'))
  const user = await db.select().from(users).where(eq(users.id, id))
  
  if (!user.length) {
    throw new HTTPException(404, { message: 'User not found' })
  }
  
  return c.json(user[0])
})
```

### With Prisma

```typescript
import { PrismaClient } from '@prisma/client'

type Env = {
  Variables: {
    prisma: PrismaClient
  }
}

const app = new Hono<Env>()

const prisma = new PrismaClient()

app.use('*', async (c, next) => {
  c.set('prisma', prisma)
  await next()
})

app.get('/users', async (c) => {
  const users = await c.var.prisma.user.findMany()
  return c.json(users)
})

app.post('/users', async (c) => {
  const body = await c.req.json()
  const user = await c.var.prisma.user.create({
    data: body,
  })
  return c.json(user, 201)
})
```

### Connection Pooling Pattern

```typescript
import { Pool } from 'pg'

let pool: Pool | null = null

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
    })
  }
  return pool
}

type Env = {
  Variables: {
    db: Pool
  }
}

const app = new Hono<Env>()

app.use('*', async (c, next) => {
  c.set('db', getPool())
  await next()
})

app.get('/users', async (c) => {
  const db = c.var.db
  const result = await db.query('SELECT * FROM users')
  return c.json(result.rows)
})
```

## Advanced RPC Patterns

### Error-as-Value Pattern

Implement Go-style error handling for better error management:

```typescript
// lib/rpc-wrapper.ts
import { ClientResponse, hc } from 'hono/client'
import type { AppType } from './server'

const client = hc<AppType>('/')

export async function callRpc<T>(
  rpc: Promise<ClientResponse<T>>
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const response = await rpc
    if (!response.ok) {
      const errorText = await response.text()
      return { data: null, error: errorText }
    }
    const data = await response.json()
    return { data: data as T, error: null }
  } catch (error) {
    return { data: null, error: (error as Error).message }
  }
}

export default client.api

// Usage in components
const { data, error } = await callRpc(api.users.$post({ json: userData }))
if (error) {
  toast.error(error)
  return
}
toast.success('User created!')
```

### RPC with SWR

```typescript
import useSWR from 'swr'
import { hc } from 'hono/client'
import type { AppType } from './server'

const client = hc<AppType>('/api')

export function useUsers() {
  return useSWR('/users', async () => {
    const res = await client.users.$get()
    if (!res.ok) throw new Error('Failed to fetch users')
    return res.json()
  })
}

export function useUser(id: string) {
  return useSWR(`/users/${id}`, async () => {
    const res = await client.users[':id'].$get({ param: { id } })
    if (!res.ok) throw new Error('Failed to fetch user')
    return res.json()
  })
}

// Usage
function UserList() {
  const { data, error, isLoading } = useUsers()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Typed Environment-Specific Clients

```typescript
// lib/client.ts
import { hc } from 'hono/client'
import type { AppType } from './server'

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '' // Browser - use relative URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

export const client = hc<AppType>(getBaseUrl())
```

## Caching Strategies

### ETag-based Caching

```typescript
import { etag } from 'hono/etag'

app.use('/api/data', etag())

app.get('/api/data', async (c) => {
  const data = await fetchData()
  return c.json(data)
})
```

### Custom Cache Headers

```typescript
app.get('/api/static-data', async (c) => {
  const data = await fetchStaticData()
  
  c.header('Cache-Control', 'public, max-age=3600, s-maxage=7200')
  c.header('Vary', 'Accept-Encoding')
  
  return c.json(data)
})
```

### KV Cache Pattern (Cloudflare)

```typescript
type Env = {
  Bindings: {
    CACHE: KVNamespace
  }
}

const app = new Hono<Env>()

app.get('/api/cached-data', async (c) => {
  const cacheKey = 'data-key'
  
  // Try to get from cache
  const cached = await c.env.CACHE.get(cacheKey, 'json')
  if (cached) {
    return c.json(cached)
  }
  
  // Fetch fresh data
  const data = await fetchExpensiveData()
  
  // Store in cache for 1 hour
  await c.env.CACHE.put(cacheKey, JSON.stringify(data), {
    expirationTtl: 3600,
  })
  
  return c.json(data)
})
```

## Observability

### Structured Logging

```typescript
import { createMiddleware } from 'hono/factory'

const structuredLogger = createMiddleware(async (c, next) => {
  const start = Date.now()
  const requestId = crypto.randomUUID()
  
  c.set('requestId', requestId)
  
  console.log(JSON.stringify({
    type: 'request',
    requestId,
    method: c.req.method,
    path: c.req.path,
    timestamp: new Date().toISOString(),
  }))
  
  await next()
  
  const duration = Date.now() - start
  
  console.log(JSON.stringify({
    type: 'response',
    requestId,
    status: c.res.status,
    duration,
    timestamp: new Date().toISOString(),
  }))
})

app.use('*', structuredLogger)
```

### OpenTelemetry Integration

```typescript
import { trace, context } from '@opentelemetry/api'
import { createMiddleware } from 'hono/factory'

const tracer = trace.getTracer('hono-app')

const openTelemetryMiddleware = createMiddleware(async (c, next) => {
  const span = tracer.startSpan(`${c.req.method} ${c.req.path}`)
  
  try {
    await context.with(trace.setSpan(context.active(), span), async () => {
      await next()
    })
    
    span.setStatus({ code: SpanStatusCode.OK })
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: (error as Error).message,
    })
    throw error
  } finally {
    span.end()
  }
})

app.use('*', openTelemetryMiddleware)
```

### Custom Metrics

```typescript
import { createMiddleware } from 'hono/factory'

interface Metrics {
  requests: Map<string, number>
  errors: Map<string, number>
}

const metrics: Metrics = {
  requests: new Map(),
  errors: new Map(),
}

const metricsMiddleware = createMiddleware(async (c, next) => {
  const route = c.req.routePath || c.req.path
  
  // Increment request counter
  const count = metrics.requests.get(route) || 0
  metrics.requests.set(route, count + 1)
  
  try {
    await next()
  } catch (error) {
    // Increment error counter
    const errorCount = metrics.errors.get(route) || 0
    metrics.errors.set(route, errorCount + 1)
    throw error
  }
})

app.use('*', metricsMiddleware)

// Metrics endpoint
app.get('/metrics', (c) => {
  return c.json({
    requests: Object.fromEntries(metrics.requests),
    errors: Object.fromEntries(metrics.errors),
  })
})
```

### Health Check Endpoints

```typescript
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

app.get('/ready', async (c) => {
  try {
    // Check database connection
    await c.var.db.query('SELECT 1')
    
    return c.json({
      status: 'ready',
      checks: {
        database: 'ok',
      },
    })
  } catch (error) {
    return c.json(
      {
        status: 'not ready',
        checks: {
          database: 'error',
        },
      },
      503
    )
  }
})
```

## Request/Response Transformation

### Response Compression

```typescript
import { compress } from 'hono/compress'

app.use('*', compress())
```

### Custom Response Format

```typescript
import { createMiddleware } from 'hono/factory'

const apiResponseMiddleware = createMiddleware(async (c, next) => {
  await next()
  
  // Only transform JSON responses
  if (c.res.headers.get('content-type')?.includes('application/json')) {
    const originalJson = await c.res.json()
    
    const wrapped = {
      success: c.res.status < 400,
      status: c.res.status,
      data: originalJson,
      timestamp: new Date().toISOString(),
    }
    
    return c.json(wrapped, c.res.status)
  }
})

app.use('/api/*', apiResponseMiddleware)
```

### Request Body Parser

```typescript
import { createMiddleware } from 'hono/factory'

const bodyParserMiddleware = createMiddleware(async (c, next) => {
  if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
    const contentType = c.req.header('content-type')
    
    if (contentType?.includes('application/json')) {
      try {
        const body = await c.req.json()
        c.set('parsedBody', body)
      } catch {
        throw new HTTPException(400, { message: 'Invalid JSON' })
      }
    }
  }
  
  await next()
})
```

## Security Best Practices

### CSRF Protection

```typescript
import { csrf } from 'hono/csrf'

app.use(
  '*',
  csrf({
    origin: ['https://example.com'],
  })
)
```

### Security Headers

```typescript
import { secureHeaders } from 'hono/secure-headers'

app.use('*', secureHeaders())

// Or custom headers
app.use('*', async (c, next) => {
  await next()
  
  c.header('X-Frame-Options', 'DENY')
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-XSS-Protection', '1; mode=block')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'"
  )
})
```

### Input Sanitization

```typescript
import sanitizeHtml from 'sanitize-html'

const sanitizeInput = (input: string) => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  })
}

app.post('/comments', async (c) => {
  const { content } = await c.req.json()
  const sanitized = sanitizeInput(content)
  
  await saveComment(sanitized)
  return c.json({ success: true })
})
```
