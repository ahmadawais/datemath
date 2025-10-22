# Hono Builder Skill - Quick Start

## 📦 What You've Got

A complete Hono development skill with:
- **SKILL.md** - Core concepts, routing, middleware, validation, RPC, testing
- **references/advanced-patterns.md** - OpenAPI, WebSockets, databases, caching, observability
- **references/express-migration.md** - Complete Express.js to Hono migration guide

## 🚀 Instant Examples

### 1. Basic API (30 seconds)
```bash
npm create hono@latest my-api
cd my-api
npm install
npm run dev
```

### 2. Type-Safe API with Validation
```typescript
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
})

app.post('/users', zValidator('json', schema), (c) => {
  const data = c.req.valid('json')  // Typed automatically!
  return c.json({ success: true, user: data })
})

export default app
```

### 3. Full-Stack with RPC (Type-Safe Client)
```typescript
// server.ts
const route = app
  .get('/api/users', (c) => c.json([{ id: 1, name: 'John' }]))
  .post('/api/users', zValidator('json', schema), (c) => {
    return c.json({ id: 2, ...c.req.valid('json') }, 201)
  })

export type AppType = typeof route

// client.ts
import { hc } from 'hono/client'
const client = hc<AppType>('/api')

// Fully type-safe! Autocomplete + type checking
const res = await client.users.$get()
const users = await res.json()  // Type: Array<{id: number, name: string}>
```

## 📖 Where to Start

**New to Hono?**
→ Start with SKILL.md sections: Quick Start, Core Concepts, Routing

**Coming from Express?**
→ Jump to references/express-migration.md

**Building production apps?**
→ Check references/advanced-patterns.md for OpenAPI, databases, caching

**Need RPC/type safety?**
→ SKILL.md section "Type-Safe RPC"

## 🎯 Common Tasks

| Task | Where to Look |
|------|---------------|
| Set up a new project | SKILL.md → Quick Start |
| Add validation | SKILL.md → Validation with Zod |
| Create middleware | SKILL.md → Middleware |
| Handle errors | SKILL.md → Error Handling |
| Use with database | references/advanced-patterns.md → Database Integration |
| Add OpenAPI docs | references/advanced-patterns.md → OpenAPI Integration |
| WebSocket support | references/advanced-patterns.md → WebSocket Support |
| Migrate from Express | references/express-migration.md |

## 💡 Key Concepts

**Context (`c`)** - Everything you need in one object:
```typescript
app.get('/example', (c) => {
  c.req.param('id')      // Path params
  c.req.query('page')    // Query strings
  await c.req.json()     // Body
  c.header('X-Custom')   // Set headers
  return c.json({})      // Response
})
```

**Middleware** - Always async with `next()`:
```typescript
app.use('*', async (c, next) => {
  console.log('Before')
  await next()
  console.log('After')
})
```

**Type Safety** - Define once, use everywhere:
```typescript
type Env = {
  Variables: { user: User }
  Bindings: { DATABASE_URL: string }
}

const app = new Hono<Env>()
// Now everything is typed!
```

## 🔥 Why Hono?

- **14kB** total size (Express is 200kB+)
- **Fastest** JavaScript router available
- **Multi-runtime** - Same code on Cloudflare Workers, Deno, Bun, Node.js
- **TypeScript-first** - Full inference without manual typing
- **Web Standards** - Uses native Request/Response
- **RPC** - Type-safe clients without code generation

## 🛠️ Installation in Claude

1. Upload the `hono-builder` folder as a Claude skill
2. Claude will automatically use it for Hono-related tasks
3. Reference files will be loaded only when needed

## 📚 Structure

```
hono-builder/
├── SKILL.md                    # Start here - core concepts
├── README.md                   # Overview and examples  
├── QUICKSTART.md              # This file
└── references/
    ├── advanced-patterns.md    # Production patterns
    └── express-migration.md    # Express → Hono guide
```

## 🎓 Learning Path

1. **Beginner** (30 min)
   - SKILL.md → Quick Start
   - SKILL.md → Core Concepts
   - SKILL.md → Routing
   - Try: Build a simple REST API

2. **Intermediate** (1 hour)
   - SKILL.md → Middleware
   - SKILL.md → Validation with Zod
   - SKILL.md → Type-Safe RPC
   - Try: Build a full-stack app with type-safe client

3. **Advanced** (2 hours)
   - references/advanced-patterns.md → All sections
   - Try: Add OpenAPI docs, WebSocket support, database integration

## 🔗 External Resources

- [Hono Docs](https://hono.dev/)
- [GitHub](https://github.com/honojs/hono)
- [Discord](https://discord.gg/hono)
- [Examples](https://hono.dev/examples)

## 💬 Getting Help

Ask Claude: "How do I [task] with Hono?"

Examples:
- "How do I add authentication middleware in Hono?"
- "How do I set up OpenAPI documentation with Hono?"
- "How do I use Hono with Prisma?"
- "Show me how to migrate this Express route to Hono"

Claude will reference this skill automatically! 🎉
