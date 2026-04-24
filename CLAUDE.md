# Wavecord

Discord clone. Next.js 15 App Router, PostgreSQL/Prisma, Socket.io (real-time chat), LiveKit (voice/video), Cloudinary (file storage), NextAuth v5 (GitHub OAuth + Credentials), Zustand + React Query.

## Dev Setup

```bash
npm install
# fill in .env.local (see Environment Variables below)
npm run db:push && npm run db:generate
npm run db:seed   # alice/bob/carol@wavecord.dev — password: password123
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run db:migrate` | Prisma migrate dev (creates migration files) |
| `npm run db:push` | Push schema without migration history (prototyping) |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:seed` | Seed test users + server |
| `npm run db:studio` | Prisma Studio at localhost:5555 |

## Environment Variables

```
DATABASE_URL=             # PostgreSQL connection string
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=             # http://localhost:3000
GITHUB_CLIENT_ID=         # github.com → Settings → Developer settings → OAuth Apps
GITHUB_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=    # cloudinary.com → Dashboard
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=   # same value as CLOUDINARY_CLOUD_NAME
LIVEKIT_API_KEY=          # cloud.livekit.io → Project Settings
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=  # wss://your-project.livekit.cloud
NEXT_PUBLIC_SITE_URL=     # http://localhost:3000
```

## Architecture

**Hybrid router**: App Router for pages + API routes. `pages/api/socket/io.ts` uses Pages Router — required because App Router lacks raw HTTP server access for Socket.io attachment.

**Key directories:**
- `app/(auth)/` — login/register pages
- `app/(main)/servers/[serverId]/channels/[channelId]/` — chat or voice room
- `app/api/` — all REST route handlers
- `pages/api/socket/` — Socket.io server init
- `components/` — chat, voice, layout, server, channel, ui subdirs
- `stores/` — Zustand: `modalStore`, `voiceStore`, `sidebarStore`
- `hooks/` — `useSocket` (connection), `useMessages` (infinite query + socket listeners)
- `lib/` — `db.ts` (Prisma singleton), `auth.ts` (requireAuth helper), `socket.ts` (IO singleton + event names)
- `prisma/` — `schema.prisma`, `seed.ts`

**Real-time flow:** API route writes to DB → `getIO()?.to(room).emit(event, payload)` → `useMessages` socket listener mutates React Query cache → component re-renders.

**Socket rooms:** `channel:{channelId}`, `server:{serverId}`, `dm:{conversationId}`

**Auth:** NextAuth v5 JWT strategy. `requireAuth()` server-side; `useSession()` client-side. `session.user.id` and `session.user.username` are custom fields extended in `types/next-auth.d.ts`.

**State layers:** URL params (serverId/channelId) → NextAuth session (identity) → Zustand (voice/modal/sidebar UI) → React Query (messages) → useState (forms/editing).

## Database Models

`User`, `Account`, `Session`, `VerificationToken` (NextAuth) · `Server`, `ServerMember` (role: ADMIN/MODERATOR/GUEST), `Ban` · `Category`, `Channel` (type: TEXT/VOICE) · `Message` (soft-delete), `Reaction`, `Attachment` · `Conversation`, `DirectMessage` · `ChannelNotification`

## Common Tasks

**New API route:** create `app/api/[resource]/route.ts`, export `GET`/`POST`/etc., call `requireAuth()` at top, broadcast via `getIO()?.to(room).emit(...)` after DB write.

**New Prisma model:** add to `schema.prisma` → `npm run db:migrate` → `npm run db:generate`.

**New Zustand store:** `stores/[name]Store.ts` → `export const useXStore = create<XState>()(...)` — no Provider needed.

**New channel type:** add to `ChannelType` enum in schema → migrate → update `CreateChannelModal.tsx` + channel page render logic.
