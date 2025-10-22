# Hono Builder Skill

A comprehensive skill for building production-ready web applications and APIs with Hono.

## What's Included

This skill provides complete guidance for working with Hono, a fast, lightweight web framework built on Web Standards that runs on any JavaScript runtime.

### Main Skill File (SKILL.md)

Contains core concepts and patterns including:
- Quick start and installation
- Routing and context API
- Middleware creation and usage
- Type-safe validation with Zod
- RPC (Remote Procedure Call) for end-to-end type safety
- Error handling
- JSX and server-side rendering
- Testing patterns
- Runtime-specific features (Cloudflare Workers, Node.js, Bun, Deno)
- Best practices

### Reference Files

#### `references/advanced-patterns.md`
Advanced techniques for production applications:
- Performance optimization
- OpenAPI integration with automatic documentation
- WebSocket support across different runtimes
- Database integration patterns (Drizzle, Prisma, connection pooling)
- Advanced RPC patterns (error-as-value, React Query integration)
- Caching strategies
- Observability (logging, tracing, metrics)
- Security best practices

#### `references/express-migration.md`
Complete migration guide from Express.js to Hono:
- Side-by-side comparisons of common patterns
- Middleware conversion examples
- Request/response handling differences
- Router organization
- Error handling migration
- Migration checklist
- Performance benefits

## When to Use This Skill

Use this skill when:
- Building REST APIs or web applications
- Creating serverless functions or edge applications
- Migrating from Express.js
- Building full-stack applications with type safety
- Working with Cloudflare Workers, Deno, Bun, or Node.js
- Need multi-runtime support (write once, deploy anywhere)

## Key Features of Hono

- **Ultrafast** - RegExpRouter is faster than Express and other frameworks
- **Lightweight** - Core is under 14kB with zero dependencies
- **Multi-runtime** - Works on Cloudflare Workers, Deno, Bun, Node.js, Vercel, AWS Lambda
- **TypeScript-first** - Full type inference without manual typing
- **RPC Support** - End-to-end type safety without code generation
- **Built on Web Standards** - Uses native Request/Response objects

## Installation

To install this skill in Claude:
1. Upload the `hono-builder` folder as a skill
2. Claude will automatically use it when building Hono applications

## Examples

### Basic API
```typescript
import { Hono } from 'hono'

const app = new Hono()

app.get('/api/users', (c) => c.json({ users: [] }))
app.post('/api/users', async (c) => {
  const body = await c.req.json()
  return c.json({ created: true }, 201)
})

export default app
```

### With Validation
```typescript
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
})

app.post('/users', zValidator('json', userSchema), (c) => {
  const data = c.req.valid('json')  // Fully typed!
  return c.json({ user: data })
})
```

### Type-Safe RPC
```typescript
// Server
const route = app
  .post('/api/users', zValidator('json', userSchema), (c) => {
    const user = c.req.valid('json')
    return c.json({ id: '123', ...user })
  })

export type AppType = typeof route

// Client
import { hc } from 'hono/client'
const client = hc<AppType>('http://localhost:3000')

const res = await client.api.users.$post({
  json: { name: 'John', email: '[email protected]' }
})
```

## Resources

- Official Documentation: https://hono.dev/
- GitHub: https://github.com/honojs/hono
- Discord Community: https://discord.gg/hono

## Skill Structure

```
hono-builder/
├── SKILL.md                          # Main skill file with core concepts
└── references/
    ├── advanced-patterns.md          # Advanced techniques and patterns
    └── express-migration.md          # Guide for migrating from Express.js
```

## Support

For questions about Hono itself, visit:
- Documentation: https://hono.dev/docs
- GitHub Issues: https://github.com/honojs/hono/issues
- Discord: https://discord.gg/hono

For questions about using this skill with Claude, refer to Claude's skills documentation.
