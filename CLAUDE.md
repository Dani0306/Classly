# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Next.js dev server (Turbopack) on :3000
npm run build      # production build — also runs the type check
npm run lint       # eslint over the project
npx tsc --noEmit   # type check only, faster than a build
npx eslint <path>  # lint specific files
```

There is no test runner. Verify changes with `tsc`, `eslint` and `next build`.

## Stack

Classly is a study app: users create **classes** and, inside them, **contents** (notes, summaries, quizzes, diagrams, homework, reminders), most of them processed by AI.

- Next.js 16 App Router + React 19. `proxy.ts` at the root is Next 16's renamed middleware. It refreshes the Supabase session and redirects unauthenticated `/app/*` requests to `/`.
- Supabase for auth (Google OAuth), Postgres and Storage. The project is reachable through the Supabase MCP server in `.mcp.json`; make schema changes as migrations.
- OpenAI Responses API (`ai/client.ts`, prompts in `ai/prompts/`). The AI actions `JSON.parse` the `output_text`, so prompts must request JSON.
- Tailwind v4 with a CSS-first theme in `app/globals.css` (shadcn-style tokens).

## Auth and data access

- Every Supabase client (`utils/supabase/server.ts`, `client.ts`) uses the **anon key plus the user's cookie session**. Server actions are not privileged: every query runs as `authenticated` under RLS. The code never uses the service-role key.
- RLS on `users`, `classes` and `contents` is owner-only (`auth.uid() = user_id`; for `users`, `= id`). A missing policy returns empty results, not an error.
- `app/auth/callback/route.ts` exchanges the OAuth code and creates the `public.users` row with `id = auth user id`.
- Production login redirects depend on Supabase **Site URL / Redirect URLs** (Auth → URL Configuration), not on code.

## Code layout conventions

- **Server actions** live in `actions/<domain>/`. The pattern: `createServerSupabase()` → `auth.getUser()` → query scoped by `user_id` → `throw new Error(...)` on failure → `revalidatePath(...)`. A `"use server"` file may only export async functions, so shared constants go in `lib/` (for example `lib/storage.ts`).
- **Pages** (`app/app/*/page.tsx`) are async server components: call the action through `tryCatch`, render `<ErrorScreen>` on error, otherwise pass data to a `"use client"` container wrapped in `PageContainer`.
- **Client mutations** go through hooks in `hooks/<domain>/` that wrap `useTransition` with `useToast` and usually `closeModal`.
- **Modals**: `useModal().openModal(node)` renders the node once. Props passed in are frozen for the modal's lifetime, and `revalidatePath` does not update them. If a modal changes data it displays, keep that data in local state (see `ShowContent`'s `fileUrls`).
- **List filters** are URL search params managed by `hooks/shared/useFilters.ts`; server pages read `searchParams`.

## Content model

- `contents.type` is the `ContentType` union in `types/index.ts`. Adding or removing a type means updating several exhaustive records, and `tsc` points to each one: `data/colors/typeColors.ts` (drives the New Content picker), `lib/contentcolors.ts`, `ContentBadge`'s `TYPE_ICONS`/`TYPE_LABELS`, `lib/contentdescriptions.ts`, `lib/contentforms.ts` (`CONTENT_FORMS` sets which form fields appear and which are required), and the `switch` in `actions/contents/createContentByType.ts`.
- **`ai_output` always wins over `content`** for display and editing. `content` is the raw user text and is only the fallback. Compare with `!= null`, not truthiness, because an empty string is a valid saved value.
- Diagrams store their generated image's public URL in `ai_output`.

## Files and storage

- Buckets: `diagrams` (AI images) and `content-files` (user uploads). Both are public.
- Object keys must be `<auth uid>/<timestamp>-<8 hex>-<sanitized name>`. Storage RLS requires the first folder to be the user's id, and the random segment prevents collisions within one batch.
- Content attachments live in `contents.files_urls` (a nullable `text[]`). Append to it through the `append_content_files` RPC, used by `actions/contents/attachFiles.ts`. The RPC appends atomically in the database; never read-modify-write the array from the client.
- `deleteContent` deletes the row first and then the `files_urls` objects. It logs storage failures instead of throwing. Deleting a class cascades to its contents in the database, which bypasses this, so those files stay in the bucket.
- URL helpers: `getStoragePath` (`lib/storage.ts`) converts a public URL to a key and returns `null` for other buckets. `getTitleByUrl` (`utils/fn.ts`) strips the key prefix and also unwraps `/_next/image?url=` URLs.
- `next.config.ts` sets `serverActions.bodySizeLimit: "5mb"` **per request**, so it limits the total size of a multi-file upload, not each file.
- `next/image` `remotePatterns` only allow Google avatars and Supabase. Local `blob:` previews must use a plain `<img>` (see `components/files/LocalFilePreview.tsx`).

## Styling and lint notes

- Use theme tokens (`bg-surface`, `bg-surface-muted`, `border-border`, `text-muted-foreground`) rather than hardcoded grays. `.dark` tokens exist, but many components still hardcode light colors.
- `--primary` is neon green `#35f527`. It works for fills, glows and rings, but has poor contrast as text or small icons.
- The React 19 hooks lint rules are enforced, including `react-hooks/set-state-in-effect` (an error). Don't call `setState` directly inside an effect body: derive the value, key the component, or run the logic in an event handler.
