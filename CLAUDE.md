# Wavecord

Discord clone. Next.js 15 App Router, PostgreSQL/Prisma, Socket.io, LiveKit (voice/video), Cloudinary, NextAuth v5 (GitHub OAuth + Credentials), Zustand + React Query.

## Dev Setup

```bash
npm install && npm run db:push && npm run db:generate
npm run db:seed   # alice/bob/carol@wavecord.dev — password: password123
npm run dev       # runs tsx server.ts (custom HTTP server + Socket.io)
```

## Scripts

`dev` · `build` · `start` · `db:migrate` · `db:push` · `db:generate` · `db:seed` · `db:studio`

## Env Vars (.env.local)

`DATABASE_URL` · `NEXTAUTH_SECRET` · `NEXTAUTH_URL` · `GITHUB_CLIENT_ID` · `GITHUB_CLIENT_SECRET` · `CLOUDINARY_CLOUD_NAME` · `CLOUDINARY_API_KEY` · `CLOUDINARY_API_SECRET` · `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` · `LIVEKIT_API_KEY` · `LIVEKIT_API_SECRET` · `NEXT_PUBLIC_LIVEKIT_URL` · `NEXT_PUBLIC_SITE_URL`

## Architecture

**Server:** `server.ts` — custom Node HTTP server wrapping Next.js. Socket.io attaches here (no `pages/api/socket` — that pattern was replaced). `setIO()` stores the singleton in `lib/socket.ts`.

**Key directories:**
- `app/(auth)/` — login/register
- `app/(main)/servers/[serverId]/channels/[channelId]/` — text or voice channel page
- `app/(main)/conversations/[conversationId]/` — DMs
- `app/api/` — all REST handlers
- `components/` — `chat/`, `dm/`, `voice/`, `layout/`, `server/`, `channel/`, `settings/`, `ui/`
- `stores/` — Zustand: `modalStore`, `voiceStore`, `sidebarStore`
- `hooks/` — `useSocket`, `useMessages`, `useDirectMessages`, `useServers`, `useVoiceSessions`
- `lib/` — `db.ts`, `auth.ts` (`requireAuth`), `socket.ts` (`getIO`/`setIO`), `sounds.ts`, `rateLimit.ts`

**Real-time flow:** API route writes DB → `getIO()?.to(room).emit(event, payload)` → hook listener updates React Query cache → re-render.

**Socket rooms:** `channel:{id}` · `server:{id}` · `dm:{conversationId}` · `user:{id}`

**Voice presence:** `server.ts` maintains in-memory `voiceRooms` (channelId → userId → session). Events: `voice:join`, `voice:leave`, `voice:state` (mute/deafen/screen-share patch). Broadcasts `voice:state:update` to `server:{serverId}`. On `join-server` emits `voice:state:snapshot` for all occupied channels.

**Presence:** `server.ts` tracks `userSockets` (userId → Set\<socketId\>). ONLINE/OFFLINE written to DB and broadcast as `user:status` to shared servers.

**Auth:** NextAuth v5 JWT. `requireAuth()` server-side; `useSession()` client-side. `session.user.id` + `session.user.username` extended in `types/next-auth.d.ts`.

**State layers:** URL (serverId/channelId) → session (identity) → Zustand (UI) → React Query (messages) → useState (forms).

## Database Models

`User` (status: ONLINE/IDLE/DND/OFFLINE, bio) · `Account/Session/VerificationToken` (NextAuth) · `Server`, `ServerMember` (ADMIN/MODERATOR/GUEST, nickname), `Ban` · `Category`, `Channel` (TEXT/VOICE, position, categoryId) · `Message` (soft-delete, replyTo), `Reaction`, `Attachment` · `Conversation`, `DirectMessage` · `ChannelNotification` (muted)

## Common Tasks

**New API route:** `app/api/[resource]/route.ts` → `requireAuth()` → DB write → `getIO()?.to(room).emit(...)`.

**New model:** edit `schema.prisma` → `db:migrate` → `db:generate`.

**New Zustand store:** `stores/[name]Store.ts`, `create<XState>()(...)`, no Provider.

**New modal type:** add to `ModalType` union in `stores/modalStore.ts` + add component in `components/`.
