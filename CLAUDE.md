# CLAUDE.md — Wavecord

## Tech Stack
- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5
- **Auth**: NextAuth v5 beta (`next-auth@5.0.0-beta.25`) — JWT strategy, GitHub OAuth + Credentials (username/password)
- **DB**: PostgreSQL (Xata-hosted), Prisma 7 ORM + `@prisma/adapter-pg` (driver adapter pattern)
- **Realtime**: Partyserver (`partyserver@0.5.3`) on Cloudflare Workers / Durable Objects; client uses `partysocket`
- **Voice**: LiveKit (`@livekit/components-react`, `livekit-server-sdk`)
- **File storage**: Cloudinary (`next-cloudinary`)
- **State**: Zustand 5, TanStack Query 5 (infinite queries for messages)
- **Validation**: Zod everywhere on API routes
- **Animation**: Framer Motion
- **Rate limiting**: in-memory (`lib/rateLimit.ts`) — resets on cold start

---

## Project Structure
```
app/
  (auth)/          # login, register pages
  (main)/          # authenticated shell
    layout.tsx     # server layout; fetches session + servers
    servers/[serverId]/channels/  # channel/voice routes
    conversations/ # DM routes
  api/             # all Route Handlers (REST)
  globals.css      # all CSS vars + global styles
components/
  chat/            # MessageList, MessageItem, MessageInput, ChatHeader, ChatArea
  dm/              # DM-specific message list + input
  channel/         # ChannelSidebar, ChannelList
  server/          # ServerSidebar, ServerHeader, MemberList, modals
  layout/          # Sidebar, NavigationRail, DMSidebar
  voice/           # VoiceChannel, VoiceParticipant
  settings/        # ProfileSettings, etc.
  providers/       # QueryProvider wrapper
  ui/              # generic primitives (buttons, inputs, avatars, etc.)
hooks/
  useParty.ts      # shared PartySocket factory (refcounted, singleton per room)
  useMessages.ts   # infinite query + channel party subscription
  useDirectMessages.ts  # same pattern for DMs
  useVoiceSessions.ts   # voice presence from main party
  useNotifications.ts   # channel notification badge logic
stores/
  modalStore.ts    # useModal — open(type, data) / close()
  voiceStore.ts    # active voice channel, mute/deafen state
  dmUnreadStore.ts # unread DM counts (in-memory)
  notificationStore.ts  # channel mention/unread badges
  sidebarStore.ts  # sidebar open/close
lib/
  db.ts            # singleton PrismaClient (globalThis guard for dev HMR)
  auth.ts          # requireAuth(), requireUserId(), getSession()
  party.ts         # publish(), publishToChannel/Server/Dm/User()
  rateLimit.ts     # in-memory sliding-window rate limiter
party/             # Cloudflare Worker — Durable Object servers
  server.ts        # MainParty (voice registry, presence fan-out per server)
  channel.ts       # ChannelParty (message broadcast only)
  dm.ts            # DmParty (DM broadcast only)
  user.ts          # UserParty (per-user; tracks connection count → ONLINE/OFFLINE)
  types.ts         # PartyEvents const enum + VoiceSession + PartyEnvelope types
  env.ts           # Env interface for DO bindings
prisma/
  schema.prisma    # single schema file
  seed.ts          # run via `npm run db:seed`
types/
  next-auth.d.ts   # augments Session.user with id, username
```

---

## Data Models (key fields only)
```
User            id, name, username(unique), email(unique), password?, image?, status(UserStatus), bio?
Server          id, name, imageUrl?, inviteCode(unique), ownerId→User
ServerMember    id, userId→User, serverId→Server, role(MemberRole), nickname?  @@unique[userId,serverId]
Category        id, name, position, serverId→Server
Channel         id, name, type(ChannelType), position, allowedRole(MemberRole), serverId, categoryId?
Message         id, content, fileUrl?, deleted, authorId→User, channelId→Channel, replyToId?→Message
DirectMessage   id, content, fileUrl?, deleted, senderId→User, conversationId→Conversation
Conversation    id, memberOneId→User, memberTwoId→User  @@unique[memberOneId,memberTwoId]
Attachment      id, url, fileType, fileName, fileSize?, messageId?, directMessageId?
Reaction        id, emoji, userId→User, messageId→Message  @@unique[userId,messageId,emoji]
Ban             id, userId, serverId, issuerId, reason?
ChannelNotification  id, userId, channelId, muted(bool)

enum UserStatus   ONLINE | IDLE | DND | OFFLINE
enum MemberRole   ADMIN | MODERATOR | GUEST
enum ChannelType  TEXT | VOICE
```

---

## Key Conventions
- **Import alias**: `@/` maps to repo root (e.g. `@/lib/db`, `@/party/types`)
- **Route Handlers**: `app/api/<resource>/route.ts`; dynamic segment: `app/api/<resource>/[id]/route.ts`
- **Server Components by default**; add `"use client"` explicitly for client components
- **Auth in RSC/Route Handlers**: `import { requireUserId } from "@/lib/auth"` — never call `auth()` directly in routes
- **Auth in middleware**: uses `auth.config.ts` (edge-safe, no DB import); full auth only in `auth.ts`
- **Prisma client**: always `import { db } from "@/lib/db"` — never `new PrismaClient()`
- **Party publish (server→client)**: `publishToChannel(channelId, PartyEvents.X, payload)` — call after DB write
- **Party subscribe (client)**: `useParty({ party, room, onMessage })` — hooks manage refcounting
- **Message pagination**: cursor-based, batch = 50, ordered `createdAt DESC`; hook reverses for display
- **Zod**: parse body in every POST/PATCH; use `.safeParse()` and return 422 on failure
- **Components colocation**: each feature dir owns its own components (no shared "pages/" dir)
- **CSS**: CSS custom properties in `app/globals.css`; no Tailwind

---

## Common Commands
```bash
npm run dev              # Next.js dev server (port 3000)
npm run dev:party        # Wrangler dev — PartyKit worker (port 8787)
npm run build            # prisma generate && next build
npm run lint             # next lint

npm run db:generate      # regenerate Prisma client after schema change
npm run db:push          # push schema changes without migration (dev)
npm run db:migrate       # create + apply migration (prisma migrate dev)
npm run db:seed          # tsx prisma/seed.ts
npm run db:studio        # Prisma Studio

npm run deploy:party     # wrangler deploy — push Cloudflare Worker
```

---

## Critical Patterns

### Auth access
```ts
// Server Component / Route Handler
const session = await requireAuth();    // redirects if unauthenticated
const userId  = await requireUserId();  // shorthand for session.user.id
// session.user.id, .username, .name, .image, .email are available
```

### Realtime event structure
```ts
// All party messages are JSON: { event: string, payload: unknown }
// Event names live in PartyEvents (party/types.ts) — use the const, never hardcode strings
// Server → client: publish*(roomId, PartyEvents.X, payload)
// Client → server (voice only): socket.send(JSON.stringify({ event, payload }))
```

### API route anatomy
```ts
export async function POST(req: Request) {
  const userId = await requireUserId();     // auth guard
  const rl = checkRateLimit(`key:${userId}`, limit, windowMs); // rate limit
  if (!rl.allowed) return tooManyRequests(rl.retryAfter);
  const parsed = Schema.safeParse(await req.json()); // validate
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  // ... db write ...
  void publishToChannel(id, PartyEvents.X, result); // broadcast (fire-and-forget ok for channel)
  return NextResponse.json(result, { status: 201 });
}
```

### Voice session flow
- Client sends `voice:join` / `voice:leave` / `voice:state` frames directly over the `main` party socket
- `MainParty` holds `voiceRooms: Map<channelId, Map<userId, VoiceSession>>` in memory (no persistence)
- On join/leave/state-change → `broadcastChannel()` emits `voice:state:update` to all server connections
- Reconnecting clients send `voice:snapshot:request`; server replies with current state

### Presence flow
- Each user opens a `user` party socket (`UserParty`) keyed by their `userId`
- First connection: `UserParty` POSTs to `NEXT_APP_URL/api/internal/presence` with `status: "ONLINE"`
- Last disconnect: same POST with `status: "OFFLINE"`
- `api/internal/presence` updates DB and fans out `user:status` to all servers the user belongs to

---

## What NOT to Do
- **Don't** import from `@/auth` directly in middleware — use `@/auth.config` (edge-safe)
- **Don't** call `new PrismaClient()` anywhere; always use `db` from `lib/db.ts`
- **Don't** hardcode PartyKit event strings — use `PartyEvents` from `@/party/types`
- **Don't** add `sslmode=require` to `DATABASE_URL` in `lib/db.ts` — the adapter strips it manually (Xata quirk)
- **Don't** expect `MainParty` voice state to survive Worker restarts — it's pure in-memory; hibernation is disabled
- **Don't** use `socket.OPEN` static constant on partysocket instances — check `readyState === 1` directly
- **Don't** run `prisma db push` in production — use `prisma migrate dev` for tracked migrations
- **Don't** add UI to `src/` — tsconfig excludes `src/**/*` for the Next.js app; `src/worker.ts` is the Cloudflare entrypoint only
- **Don't** rely on in-memory rate limiter surviving cold starts (Vercel/serverless); it resets per instance
- **Don't** add secrets to `wrangler.toml` — use `wrangler secret put` for `PARTYKIT_SECRET` and `NEXT_APP_URL`
- **Don't** open multiple direct PartySocket connections for the same `(party, room)` — `useParty` shares one socket via process-level cache; bypass will leak sockets
