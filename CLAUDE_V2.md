# Kisku v2 — additions and changes

## What's new in v2
User accounts, persistent album storage, and photo storage in
Cloudflare R2. Users can save albums, return to edit them, and
manage their history from a dashboard.

## New dependencies
```bash
npm install next-auth@5 @auth/prisma-adapter @prisma/client prisma @aws-sdk/client-s3 resend
npx prisma init
```

## Auth — NextAuth v5 + Resend email OTP

Passwordless email sign-in via magic link. No passwords, no
registration flow. Resend handles email delivery.

Chosen for portability — swapping to Clerk, Google, or any OIDC
provider later only requires changing lib/auth.ts and env vars.

```
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://kisku.online
AUTH_RESEND_KEY=
```

### lib/auth.ts
```ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import Resend from 'next-auth/providers/resend'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: 'noreply@kisku.online',
    })
  ],
})
```

### app/api/auth/[...nextauth]/route.ts
```ts
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

### middleware.ts
```ts
export { auth as middleware } from '@/lib/auth'
export const config = {
  matcher: ['/dashboard/:path*', '/album/:path*', '/api/albums/:path*']
}
```

### Protecting API routes
```ts
import { auth } from '@/lib/auth'
const session = await auth()
if (!session?.user) return new Response('Unauthorized', { status: 401 })
const userId = session.user.id
```

### Sign-in page /sign-in
Simple single-field form — email input + "Send magic link" button.
On submit call signIn('resend', { email, redirectTo: '/dashboard' }).
Show a confirmation message after submit:
"Check your email — we've sent a sign-in link to {email}"
No password field, no sign-up page — account is created automatically
on first sign-in.

### Resend domain setup
Verify kisku.online as a sending domain in the Resend dashboard.
Add the TXT and MX DNS records to Namecheap. Required before
magic link emails will deliver.

## Database — Neon + Prisma

```
DATABASE_URL=
```

### lib/prisma.ts — singleton
```ts
import { PrismaClient } from '@prisma/client'
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(cuid())
  name      String?
  email     String?   @unique
  image     String?
  createdAt DateTime  @default(now())
  albums    Album[]
  accounts  Account[]
  sessions  Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model Album {
  id          String       @id @default(cuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  title       String       @default("Untitled album")
  printSizeId String
  orientation String
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  photos      AlbumPhoto[]
}

model AlbumPhoto {
  id         String @id @default(cuid())
  albumId    String
  album      Album  @relation(fields: [albumId], references: [id], onDelete: Cascade)
  order      Int
  r2Key      String
  zoom       Float  @default(1)
  panX       Float  @default(0)
  panY       Float  @default(0)
  rotation   Float  @default(0)
  border     Json
  textLayers Json
}
```

## Object storage — Cloudflare R2

```
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

### lib/r2.ts — singleton
```ts
import { S3Client } from '@aws-sdk/client-s3'
export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})
```

### Presigned upload flow
Browser never sends photo bytes through the Next.js server.

```
1. Browser  →  POST /api/upload/sign { filename, contentType }
2. API      →  returns { url: presignedPutUrl, key: r2Key }
3. Browser  →  PUT photo directly to R2 using presignedPutUrl
4. Browser  →  saves r2Key into PhotoState
5. On save  →  r2Key written to AlbumPhoto record in DB
```

Photo URLs for display: `${R2_PUBLIC_URL}/${r2Key}`

R2 key format: `albums/{userId}/{albumId}/{photoId}.jpg`

### POST /api/upload/sign
```ts
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '@/lib/r2'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  const { filename, contentType } = await req.json()
  const key = `albums/${session.user.id}/${crypto.randomUUID()}/${filename}`

  const url = await getSignedUrl(r2, new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  }), { expiresIn: 300 })

  return Response.json({ url, key })
}
```

## New API routes

| Method | Route                   | Action                        |
|--------|-------------------------|-------------------------------|
| POST   | /api/upload/sign        | Generate R2 presigned PUT URL |
| GET    | /api/albums             | List user's albums            |
| POST   | /api/albums             | Create new album              |
| GET    | /api/albums/[id]        | Get album + photos            |
| PATCH  | /api/albums/[id]        | Update title / config         |
| DELETE | /api/albums/[id]        | Delete album + R2 objects     |
| POST   | /api/albums/[id]/photos | Add photo to album            |

All routes verify session before any DB operation. All DB queries
filter by userId to prevent cross-user data access.

## New folder structure

```
app/
  page.tsx                        ← marketing landing page
  layout.tsx
  sign-in/page.tsx                ← email input + magic link sent state
  dashboard/page.tsx              ← saved albums grid
  album/
    new/page.tsx                  ← editor, new album
    [id]/page.tsx                 ← editor, load existing album
  privacy/page.tsx
  api/
    auth/[...nextauth]/route.ts
    upload/sign/route.ts
    albums/
      route.ts
      [id]/
        route.ts
        photos/route.ts
middleware.ts
lib/
  auth.ts                         ← NextAuth config
  prisma.ts                       ← Prisma singleton
  r2.ts                           ← R2 S3 client singleton
components/
  AlbumCard.tsx                   ← dashboard grid card
  SaveAlbumModal.tsx              ← prompt after download
  DeleteAlbumModal.tsx            ← confirm before delete
prisma/
  schema.prisma
```

## Updated PhotoState type

```ts
export type PhotoState = {
  id: string
  file?: File         // present before R2 upload
  objectUrl: string   // local blob URL or R2 public URL
  r2Key?: string      // set after upload to R2
  zoom: number
  panX: number
  panY: number
  rotation: number
  border: BorderState
  textLayers: TextLayer[]
}
```

## New screens

### Sign-in /sign-in
Single email input field. No password, no sign-up page.
Account created automatically on first sign-in.
Two states:
- Default: email input + "Send magic link" button
- Sent: "Check your email — we sent a sign-in link to {email}"

### Dashboard /dashboard
- Grid of AlbumCard components
- Each card: thumbnail, title, print size, photo count, date,
  edit and delete actions
- "New album" button → /album/new
- Empty state with prompt to create first album

### AlbumCard component
- Thumbnail from R2_PUBLIC_URL + first photo r2Key
- Title editable inline on click
- Subtitle: print size · N photos · date
- Edit button → /album/[id]
- Delete button → DeleteAlbumModal

### SaveAlbumModal
Shown after user hits download. Asks for album title.
On confirm: creates Album record, uploads each photo to R2 via
presigned URL, saves AlbumPhoto records with r2Key + editor state.
On skip: works like v1, no save.

### Load existing album /album/[id]
Fetches Album + AlbumPhoto records from DB. Reconstructs
PhotoState[] with objectUrl = R2_PUBLIC_URL + r2Key and all
editor state fields. Opens editor at step 3 (adjust screen).

### Privacy policy /privacy
Plain English. Cover:
- Photos stored in Cloudflare R2 (US region)
- Album metadata stored in Neon Postgres
- No third-party sharing
- Users can delete all data from dashboard
- Retention: data deleted within 30 days of account deletion

## Updated T&Cs

v1 said no photos are stored. v2 stores photos when user saves
an album. Update TermsModal copy:

> When you save an album, your photos are stored securely in
> Cloudflare R2 and your album settings are saved to our database.
> You can delete your albums and all associated data at any time
> from your dashboard. We do not share your photos or data with
> any third party.

Add checkbox: "I agree to the privacy policy" linking to /privacy.

## Rules — v2 additions
- Never route photo bytes through the Next.js server
- Always verify session in every API route before DB operations
- All DB queries must filter by userId — never trust client-supplied userId
- Use onDelete: Cascade on AlbumPhoto so photos clean up with album
- When deleting an album, also delete R2 objects via DeleteObjectsCommand
- R2 key must include userId to prevent cross-user access
- Prisma and R2 clients must use singleton pattern
- Dashboard must only return albums belonging to the authenticated user
- To swap auth provider later: only lib/auth.ts and env vars change
- No sign-up page needed — account created on first magic link sign-in

## Build order for Claude Code

Run in sequence — complete and review each before the next.

```
1. Auth
   Install next-auth@5, @auth/prisma-adapter, resend. Create
   lib/auth.ts with NextAuth, PrismaAdapter, and Resend provider
   using noreply@kisku.online. Add app/api/auth/[...nextauth]/route.ts.
   Add middleware.ts protecting dashboard, album, and api/albums routes.
   Build sign-in page with email input and magic link sent confirmation
   state. Test full sign-in flow end to end.

2. Database
   Install prisma and @prisma/client. Add DATABASE_URL for Neon.
   Write schema.prisma with all models above including NextAuth tables
   (Account, Session, VerificationToken). Run npx prisma migrate dev.
   Create lib/prisma.ts singleton.

3. R2
   Install @aws-sdk/client-s3. Add R2 env vars. Create lib/r2.ts
   singleton. Implement POST /api/upload/sign using getSignedUrl with
   PutObjectCommand. Key format: albums/{userId}/{uuid}/{filename}.
   Return { url, key }. Test with a manual PUT request.

4. Save album flow
   Create POST /api/albums and POST /api/albums/[id]/photos.
   Build SaveAlbumModal — on confirm, upload each PhotoState.file to
   R2 via presigned URL, then create Album + AlbumPhoto records.
   Show modal after download in step 4. On skip proceed as v1.

5. Dashboard
   Create GET /api/albums returning authenticated user's albums
   ordered by updatedAt desc, including first photo r2Key for
   thumbnail. Build /dashboard page with AlbumCard grid and
   New album button. Add empty state.

6. Load album
   Create GET /api/albums/[id] returning album + all AlbumPhoto
   records ordered by order asc. Build /album/[id] page that
   reconstructs PhotoState[] using R2_PUBLIC_URL + r2Key as
   objectUrl, then opens editor at step 3.

7. Delete album
   Add DELETE /api/albums/[id] that fetches all r2Keys, calls
   DeleteObjectsCommand for all R2 objects, then deletes the Album
   record (AlbumPhoto cascades). Build DeleteAlbumModal with confirm
   step. Remove card from dashboard optimistically on success.

8. Privacy policy + T&Cs update
   Create /privacy page with plain English privacy policy.
   Update TermsModal to reflect v2 storage, add privacy policy
   checkbox, and link to /privacy. Add /privacy link to footer.
```