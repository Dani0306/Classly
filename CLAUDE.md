# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. It aims to describe the whole app (product, schema, data flow, conventions) so a new session can work without re-exploring.

## Commands

```bash
npm run dev        # Next.js dev server (Turbopack) on :3000
npm run build      # production build — also runs the type check
npm run lint       # eslint over the project
npx tsc --noEmit   # type check only, faster than a build
npx eslint <path>  # lint specific files
```

There is no test runner. Verify changes with `tsc`, `eslint` and `next build`.

## Product overview

Classly is an AI study app for students. After signing in with Google, a user:

1. Creates **classes** (name, description, icon + color, optional weekly schedule).
2. Inside a class, creates **contents**. Every creatable type runs an AI call:
   - `note`: AI proofreads the text (grammar/spelling only, markdown converted to plain text).
   - `summarize`: AI writes a titled markdown summary at a chosen length.
   - `reminder` / `homework`: proofread like notes, plus `due_date` and `priority`; can be marked complete.
   - `quiz`: AI generates up to 10 multiple-choice questions, answered in-app; submitting saves the answers and sets `is_completed`.
   - `diagram`: AI generates a PNG diagram (8 layouts) stored in Supabase Storage.
3. Attaches files (images, PDF, Word) to any content.
4. Browses everything on **All Contents** (search / type / due-date filters) and sees class sessions plus homework and reminder due dates on the **Calendar**.
5. Manages profile, plan and AI usage in **Settings**, and upgrades to **Pro** through Paddle.

Plans: **Starter** (free) and **Pro** ($12/mo). Limits are enforced in the database (see "AI usage and plan limits").

## Stack

- Next.js 16.1 App Router, React 19.2, TypeScript strict. Path alias `@/*` points to the repo root.
- `proxy.ts` at the root is Next 16's renamed middleware. It redirects unauthenticated `/app/*` requests to `/` and refreshes the Supabase session (`utils/supabase/middleware.ts`).
- Supabase (`@supabase/ssr`) for auth (Google OAuth only), Postgres and Storage. Project ref `disdpqeogqiwjupnryqp`, reachable through the Supabase MCP server in `.mcp.json`. **There is no local `supabase/` folder.** Migrations exist only in the remote project, so make schema changes with the MCP `apply_migration` tool.
- OpenAI Responses API (`openai` SDK, `ai/client.ts`, prompts in `ai/prompts/`). Models: `gpt-5-mini` for text, `gpt-4.1-mini` with the `image_generation` tool for diagrams. The text actions `JSON.parse` the `output_text`, so prompts must request raw JSON.
- Paddle Billing (`@paddle/paddle-js` for checkout, `@paddle/paddle-node-sdk` on the server).
- Tailwind v4 with a CSS-first theme in `app/globals.css` (shadcn-style tokens). shadcn components (`components.json`, style `radix-nova`) live in `components/ui/`.
- Other libs: `lucide-react` icons, `date-fns`, `react-day-picker`, `react-dropzone` (file input), `react-markdown` (summaries), `docx-preview` (Word thumbnails), `react-intersection-observer` (landing animations), `mermaid` (installed, currently unused).
- Fonts: Sora (local, `fonts/`, the `--font-sans` in use) and Geist. The root layout forces `className="light"`.

### Environment variables (`.env.local`, git-ignored)

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | every Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | `utils/supabase/admin.ts` (webhook only) |
| `OPENAI_API_KEY` | `ai/client.ts` |
| `NEXT_PUBLIC_PADDLE_ENV` | `"production"` → live; anything else → sandbox |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`, `NEXT_PUBLIC_PADDLE_PRO_PRICE_ID` | Paddle.js checkout |
| `PADDLE_API_KEY` | `lib/paddle/server.ts` (portal sessions, webhook unmarshal) |
| `PADDLE_WEBHOOK_SECRET` | `app/api/paddle/webhook/route.ts` |

## Routes

| Route | File | What it does |
|---|---|---|
| `/` | `app/page.tsx` | Landing (header, hero, feature cards, pricing, testimonials, footer; content in `data/landing/`). Login opens `components/auth/LoginModal.tsx` → `signInWithOAuth({ provider: "google", redirectTo: <origin>/auth/callback })`. |
| `/auth/callback` | `app/auth/callback/route.ts` | Exchanges the OAuth code, creates the `public.users` row (`createUser`, `id = auth uid`, `plan: "starter"`), redirects to `?next` or `/app/classes`. |
| `/app/*` layout | `app/app/layout.tsx` | `Aside` shell: collapsible sidebar (`components/sidebar/`, links in `data/sidebar/links.ts`) + `UserCard`. |
| `/app/classes` | `app/app/classes/page.tsx` | Class grid. `?search=` filter. |
| `/app/class/[id]` | `app/app/class/[id]/page.tsx` | One class's contents, with type pills (`?type=`) and the "New" content modal. |
| `/app/contents` | `app/app/contents/page.tsx` | All contents across classes. `?search=`, `?type=`, `?dueDate=YYYY-MM-DD`. |
| `/app/calendar` | `app/app/calendar/page.tsx` | Day / week / month calendar. `?type=class\|homework\|reminder\|all`. |
| `/app/settings` | `app/app/settings/page.tsx` | Profile, plan (usage, upgrade / manage subscription), account (sign out). |
| `/app/dashboard` | `app/app/dashboard/page.tsx` | Static "Ask Classly AI" placeholder. Not linked in the sidebar, no logic. |
| `POST /api/paddle/webhook` | `app/api/paddle/webhook/route.ts` | Paddle notifications (see Billing). |

## Database schema (Supabase Postgres, `public`)

RLS is enabled on every table. All policies are for the `authenticated` role; `anon` gets nothing.

### `users`: app profile, one row per auth user

| column | type | notes |
|---|---|---|
| `id` | uuid PK | default `gen_random_uuid()`, but always set to the auth user's id by the callback. No FK to `auth.users`. |
| `name` | text not null | |
| `email` | text not null | |
| `image_url` | text null | Google avatar by default |
| `plan` | text not null default `'starter'` | check `in ('starter','pro')`. Derived from billing, never written by the app. |
| `created_at` | timestamptz default now() | |
| `updated_at` | timestamp (no tz) null | |

- Policies: select/update/delete own (`auth.uid() = id`); insert only with `auth.uid() = id AND plan = 'starter'`.
- Column grants: `authenticated` may UPDATE only `name`, `image_url`, `updated_at`, so `plan` can't be changed by users.

### `classes`

| column | type | notes |
|---|---|---|
| `id` | uuid PK default gen_random_uuid() | |
| `user_id` | uuid not null | FK → `auth.users(id)` ON DELETE CASCADE |
| `name` | text not null | |
| `description` | text not null | |
| `icon` | text null | a key from `data/icons/icons.ts` (`bookOpen`, `flask`, `sigma`, `globe`, `palette`, `scrollText`, `microscope`, `terminal`, `brain`, `compass`, `stethoscope`, `more`) |
| `color` | text null | hex, derived from the chosen icon's color |
| `schedule` | jsonb not null default `'[]'` | `ScheduleEntry[]`: `{ day: 0-6 (0 = Sunday, JS getDay), start_time: "HH:MM", end_time: "HH:MM" }` |
| `created_at` | timestamptz default now() | |
| `updated_at` | timestamptz null | set by the app on update |

Policies: owner-only select/insert/update/delete (`auth.uid() = user_id`).

### `contents`: everything created inside a class (renamed from `notes`; constraint names still say `notes_*`)

| column | type | notes |
|---|---|---|
| `id` | uuid PK default gen_random_uuid() | |
| `user_id` | uuid not null | FK → `auth.users(id)` ON DELETE CASCADE |
| `class_id` | uuid not null | FK → `classes(id)` ON DELETE CASCADE |
| `type` | text not null | `ContentType`, no DB check constraint |
| `title` | text not null | AI may correct it on creation |
| `content` | text not null | raw user input |
| `ai_output` | text null | AI result: corrected text (note/reminder/homework), markdown summary (summarize), JSON `QuizQuestion[]` (quiz), public image URL (diagram) |
| `due_date` | timestamp (no tz) null | a calendar day, not a moment. Compare on the `YYYY-MM-DD` part. |
| `priority` | text null | `'low' \| 'medium' \| 'high'` |
| `is_completed` | bool default false | homework/reminder done; quiz submitted |
| `status` | text null | **unused** |
| `files_urls` | text[] null | public URLs in the `content-files` bucket |
| `created_at` / `updated_at` | timestamptz | |

Policies: owner-only CRUD (`auth.uid() = user_id`).

### `paddle_subscriptions`: cache of Paddle subscriptions, written only by the webhook

| column | type | notes |
|---|---|---|
| `subscription_id` | text PK | Paddle `sub_...` |
| `user_id` | uuid not null | FK → `public.users(id)` ON DELETE CASCADE; indexed |
| `customer_id` | text not null | Paddle `ctm_...` |
| `status` | text not null | check `in ('active','trialing','past_due','paused','canceled')` |
| `price_id`, `product_id` | text null | |
| `current_period_ends_at` | timestamptz null | |
| `scheduled_change_action` | text null | `cancel` / `pause` / `resume` |
| `scheduled_change_at` | timestamptz null | |
| `paddle_updated_at` | timestamptz not null | used to ignore out-of-order events |
| `created_at`, `updated_at` | timestamptz default now() | |

Policy: select own only. No write policies; writes go through the service-role RPC.

### `plan_limits`: per-plan AI allowances (PK `plan, kind`)

`kind` check: `grammar | summary | quiz | diagram | any`. `monthly_limit` / `daily_limit`: `null` = unlimited, `0` = feature not in the plan. Readable by any authenticated user. Current rows:

| plan | grammar | summary | quiz | diagram | any |
|---|---|---|---|---|---|
| starter | 20 / month | 5 / month | 0 (not included) | 0 (not included) | none |
| pro | unlimited | unlimited | unlimited | 30 / month | daily_limit 100 (rolling 24h, all kinds together) |

### `ai_usage`: one row per AI generation

`id` uuid PK, `user_id` → `public.users(id)` ON DELETE CASCADE, `kind` (`grammar|summary|quiz|diagram`), `created_at`. Index `(user_id, created_at desc)`. Policy: select own. Rows are inserted and deleted only by the functions below.

### Database functions (all `search_path = ''`)

| function | security | purpose |
|---|---|---|
| `consume_ai_credit(p_kind text) → uuid` | definer | Takes a per-user advisory lock, checks `plan_limits` for the user's plan (`feature_not_in_plan` when missing or 0; `monthly_limit_reached` against usage since `date_trunc('month', now())`; `daily_limit_reached` against the `any` row over the last 24h), then inserts into `ai_usage` and returns its id. Raises `not_authenticated` without a session/profile. |
| `refund_ai_credit(p_usage_id uuid)` | definer | Deletes the caller's own usage row if it's younger than 15 minutes. |
| `append_content_files(p_content_id uuid, p_urls text[]) → text[]` | invoker | Atomically appends URLs to `contents.files_urls` for the caller's row; returns the new array. |
| `remove_content_files(p_urls text[]) → int` | invoker | Removes those URLs from any of the caller's contents that list them; returns rows updated. |
| `upsert_paddle_subscription(...)` | invoker (service role only) | Insert/update by `subscription_id`, only when the incoming `paddle_updated_at` ≥ the stored one. |
| `sync_user_plan_from_paddle()` | definer, trigger | `AFTER INSERT/UPDATE/DELETE ON paddle_subscriptions`: sets `users.plan = 'pro'` if the user has any `active`/`trialing`/`past_due` subscription, else `'starter'`. |

### Migrations applied (remote only)

`enable_owner_rls_policies`, `create_content_files_bucket`, `append_content_files_fn`, `remove_content_files`, `remove_content_files_by_url`, `content_files_allow_word`, `remove_content_files_revoke_anon`, `lock_users_plan`, `users_insert_starter_only`, `paddle_subscriptions`, `ai_usage_and_plan_limits`, `ai_credit_functions`.

### Storage buckets

| bucket | public | limits | policies |
|---|---|---|---|
| `content-files` | yes | 5 MB/file; MIME: png, jpeg, webp, gif, pdf, msword, docx | select/insert/update/delete when `foldername(name)[1] = auth.uid()` |
| `diagrams` | yes | none | insert only, first folder = `auth.uid()` (no delete policy) |

## TypeScript model (`types/index.ts`)

- `Plan = "starter" | "pro"`; `AppUser` (users row); `UpdateProfile = Pick<AppUser, "name" | "image_url">`.
- `SubscriptionStatus`, `BillingSubscription` (subset of `paddle_subscriptions`).
- `ScheduleEntry`, `Class`, `NewClass`, `UpdateClass`.
- `ContentType = "note" | "summarize" | "reminder" | "homework" | "quiz" | "diagram" | "class"`. `"class"` is not a real content type; it exists only so colors, labels and descriptions can style classes. `CreatableContentType = Exclude<ContentType, "class">`.
- `ContentPriority`, `Content`, `NewContent`, `UpdateContent`, `CreateContentInput` (form payload: `type, classId, title, text, dueDate?, priority?, size?, diagramType?, constraints?, files: File[]`).
- `QuizQuestion = { question, answers: string[4], correct_answer, selected_answer? }`.
- `DiagramType = flowchart | mindmap | orgchart | venn | timeline | comparison | cycle | pyramid` (labels in `data/diagram/diagramTypes.ts`).
- Calendar: `EventKind = class | homework | reminder`, `EventData` (server → client, plain strings), `Event` (client, real `Date`s).
- `ViewType = "content" | "attachments"` (tab inside a content modal), `DropDownMenuOptions`, `SearchParamProps`.

There are no generated Supabase types. Query results are cast to these types by hand.

## Auth and data access

- Every Supabase client (`utils/supabase/server.ts` `createServerSupabase`, `client.ts` `createBrowserSupabase`) uses the **anon key plus the user's cookie session**. Server actions are not privileged: every query runs as `authenticated` under RLS. The one exception is `utils/supabase/admin.ts` (service-role key, `server-only`), used only by the Paddle webhook after it verifies the signature.
- `users.plan` (`'starter' | 'pro'`) can't be written by users: column grants leave it out of UPDATE and RLS only allows `'starter'` on INSERT. It is derived from `paddle_subscriptions` by a trigger.
- RLS on `users`, `classes` and `contents` is owner-only (`auth.uid() = user_id`; for `users`, `= id`). A missing policy returns empty results, not an error. Actions still add `.eq("user_id", user.id)` explicitly.
- `app/auth/callback/route.ts` exchanges the OAuth code and creates the `public.users` row with `id = auth user id`. `getMyProfile` falls back to auth metadata if the row is missing.
- Production login redirects depend on Supabase **Site URL / Redirect URLs** (Auth → URL Configuration), not on code.

## Server actions (`actions/`)

All are `"use server"`, and all call `auth.getUser()` first and throw if there is no user.

- **ai/**: `correctGrammar.ts` (`grammarCorrection(title, text)` → `{ title, description }`), `generateSummary.ts` (→ `{ title, text }`), `generateQuiz.ts` (→ `QuizQuestion[]`), `generateDiagram.ts` (uploads the PNG to `diagrams/<uid>/<ts>.png` and returns a public URL), `getMyAiUsage.ts` (`AiUsageSummary`: plan, per-kind `{ used, limit }` for this UTC month, `resetsOn`). These do **not** consume credits themselves; `createContentByType` does.
- **billing/**: `getMySubscription` (the active subscription, else the most recently updated, else null), `createPortalSession` (Paddle customer portal URL, created per click).
- **calendar/**: `getMyEvents(type?)` → `EventData[]`: one entry per class schedule slot plus homework/reminders that have a `due_date` (`dueDate` = first 10 chars).
- **classes/**: `createClass`, `getMyClasses(search?)` (ilike on name/description/icon/color), `getClass(id, type?)` (class + its contents, newest first), `modifyClass`, `deleteClass`.
- **contents/**: `createContentByType(input)` (the main creation pipeline, below), `getAllContents(search?, type?, dueDate?)` (quotes the search term for PostgREST `.or()`), `modifyContent(partial, id)`, `deleteContent(id)`, `attachFiles(contentId, files)`.
- **files/**: `uploadFiles(files)` (validates size/MIME, uploads to `content-files`, rolls back the batch on failure, returns public URLs), `deleteFiles(url | urls)` (only keys in the caller's folder; detaches via `remove_content_files` first, then removes objects).
- **user/**: `createUser`, `getMyProfile`, `updateProfile` (name required), `signOut` (redirects to `/`).

### Content creation pipeline (`actions/contents/createContentByType.ts`)

1. Require a non-empty title and text.
2. `consumeAiCredit(AI_KIND_BY_CONTENT_TYPE[type])` (`lib/ai/credits.ts`, `server-only`). This maps note/reminder/homework → `grammar`, summarize → `summary`, quiz → `quiz`, diagram → `diagram`. RPC error codes become friendly messages.
3. `buildContent`: uploads attachments, then runs the type's AI call and fills `ai_output` (and `title` for grammar/summary, `due_date`/`priority` for reminder/homework).
4. Insert into `contents`. If step 3 or 4 fails, `refundAiCredit(usageId)` runs and the error is rethrown. Uploaded files are not rolled back in that case.
5. `revalidatePath("/app/class/[id]", "page")`.

The client side is `CreateContentModal` → `SelectContentTypeView` (type picker; quiz/diagram show a "Pro" lock for Starter) → `CreateContent` (form driven by `CONTENT_FORMS`, `AllowanceNote` shows remaining credits from `useAiUsage`) → `useCreateContent`.

## AI usage and plan limits

- Limits live in `plan_limits` and are enforced only by `consume_ai_credit`. The UI hints (`AllowanceNote`, `UsageSummary`, the Pro locks in `SelectContentTypeView`) are advisory. The type-picker lock is hardcoded (`plan === "starter"` for quiz/diagram), so update it if `plan_limits` changes.
- Kinds and labels: `lib/ai/kinds.ts` (`AiKind`, `AI_KINDS`, `AI_KIND_BY_CONTENT_TYPE`, `AI_KIND_LABELS`).
- To change allowances, update `plan_limits` rows (migration). Also keep the marketing copy in `data/settings/plans.ts` and `data/landing/pricing.ts` roughly in sync; it is not enforced.
- Any new AI feature must call `consumeAiCredit` before the model call and `refundAiCredit` on failure.

## Billing (Paddle)

- Upgrade opens Paddle.js checkout (`hooks/billing/useUpgradeToPro.ts`, `lib/paddle/client.ts`) with `customData.user_id` and the user's email. After `checkout.completed` it polls `getMySubscription` every 2s (up to 15 times) and then `router.refresh()`.
- `app/api/paddle/webhook/route.ts` verifies the `paddle-signature` against the raw body (`paddle.webhooks.unmarshal`). It handles only `subscription.created` / `subscription.updated`. The first event links the subscription to a user via `customData.user_id` (must be a UUID of an existing user); later events use the stored owner. It then calls the `upsert_paddle_subscription` RPC (service role only), which ignores events older than the stored row. It returns 500 only for retryable DB errors and 200 for events it can't link.
- A trigger on `paddle_subscriptions` sets `users.plan`: `pro` while any subscription is `active`, `trialing` or `past_due`.
- "Manage subscription" creates a Paddle customer portal session (`actions/billing/createPortalSession.ts`, opened in a tab pre-opened during the click). Cancelling there is how users return to Starter.
- Sandbox and live are separate Paddle accounts. `PADDLE_API_KEY`, `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`, `PADDLE_WEBHOOK_SECRET` and `NEXT_PUBLIC_PADDLE_PRO_PRICE_ID` must all come from the account selected by `NEXT_PUBLIC_PADDLE_ENV`.

## Content model

- `contents.type` is the `ContentType` union in `types/index.ts`. Adding or removing a type means updating several exhaustive records, and `tsc` points to each one: `data/colors/typeColors.ts` (drives the New Content picker and the class type pills), `lib/contentcolors.ts`, `ContentBadge`'s `TYPE_ICONS`/`TYPE_LABELS`, `lib/contentdescriptions.ts`, `lib/contentforms.ts` (`CONTENT_FORMS` sets which form fields appear and which are required), `lib/ai/kinds.ts` (`AI_KIND_BY_CONTENT_TYPE`), and the `switch` in `actions/contents/createContentByType.ts`. The `FILTER_TYPES` list in `components/contentsPage/ContentsContainer.tsx` is not type-checked for exhaustiveness.
- **`ai_output` always wins over `content`** for display and editing. `content` is the raw user text and is only the fallback. Compare with `!= null`, not truthiness, because an empty string is a valid saved value (`hooks/contents/useContentText.ts` picks which column an edit writes to).
- Diagrams store their generated image's public URL in `ai_output`. Quizzes store `JSON.stringify(QuizQuestion[])`. On submit, `useQuiz` writes back the questions with `selected_answer` filled and `is_completed: true`, which locks the quiz.
- Summaries are markdown with `**bold**` and `- ` bullets. The grammar prompt strips markdown to plain text on purpose.
- `CONTENT_FORMS` fields: `description` (main textarea), `dueDate` + `priority` (required for reminder/homework), `size` (summary length, `SUMMARY_SIZES`), `diagramType` (required for diagram) and `constraints` (optional diagram instructions).

### How contents are shown

- `ContentCard` (grid card) opens a modal: `QuizComponent` for quizzes, otherwise `ShowContent`.
- `ShowContent` = `ContentHeader` (title, type badge, Attachments tab, due date/priority) + `ContentBody` (`DiagramPreview` for diagrams, otherwise `TextToEdit`, an inline textarea that saves on blur) or `Attachments` + `ContentFooter` (complete/reopen for homework and reminders, Edit/Save, Delete).
- Card previews use `AIOutputSmall` (`ai_output ?? content`); quiz and diagram cards show the truncated raw `content`.

## Files and storage

- Buckets: `diagrams` (AI images) and `content-files` (user uploads). Both are public.
- Object keys must be `<auth uid>/<timestamp>-<8 hex>-<sanitized name>` (`sanitizeFileName` in `utils/fn.ts`). Storage RLS requires the first folder to be the user's id, and the random segment prevents collisions within one batch.
- Accepted types and size live in `lib/storage.ts` (`ACCEPTED_FILE_TYPES`, `MAX_FILE_SIZE` = 5 MB, `resolveMimeType` falls back to the extension for Word files with an empty MIME). The bucket's `allowed_mime_types` must list the same types.
- Content attachments live in `contents.files_urls` (a nullable `text[]`). Append to it through the `append_content_files` RPC, used by `actions/contents/attachFiles.ts`. The RPC appends atomically in the database; never read-modify-write the array from the client. Removal likewise goes through `remove_content_files` (in `deleteFiles`).
- `deleteContent` deletes the row first and then the `files_urls` objects. It logs storage failures instead of throwing. Deleting a class cascades to its contents in the database, which bypasses this, so those files stay in the bucket. Diagram images are never deleted.
- URL helpers: `getStoragePath` (`lib/storage.ts`) converts a public URL to a key and returns `null` for other buckets. `getTitleByUrl` (`utils/fn.ts`) strips the key prefix and also unwraps `/_next/image?url=` URLs. `isImageFile` / `isPdfFile` / `isWordFile` / `isDocxFile` classify by extension.
- `next.config.ts` sets `serverActions.bodySizeLimit: "5mb"` **per request**, so it limits the total size of a multi-file upload, not each file.
- `next/image` `remotePatterns` only allow Google avatars and Supabase. Local `blob:` previews must use a plain `<img>` (see `components/files/LocalFilePreview.tsx`). Word previews render with `docx-preview` (`WordThumbnail`); legacy `.doc` can't be rendered.

## Calendar

- The server sends `EventData` with plain strings; `components/calendar/utils.ts` `buildEvents` turns it into `Date`s **in the browser** so days and times aren't shifted by the server's UTC timezone. Classes repeat on every visible day matching `day`; homework and reminders are all-day on `dueDate` (parsed as local midnight).
- Views: `full-calendar.tsx` (header, filter, Day/Week/Month tabs; weeks start Monday), `week-view.tsx`, `month-view.tsx`, `event-block.tsx`, `event-details.tsx`. Visible hours are 5–23, 64 px per hour.
- Event colors come from `KIND_COLORS` in `components/calendar/utils.ts`. `lib/kindcolors.ts` is an unused duplicate with different colors.

## Code layout conventions

```
actions/<domain>/     server actions ("use server"; async function exports only)
ai/                   OpenAI client + prompt builders (ai/prompts/*Prompt.ts)
app/                  routes (see Routes)
components/<area>/    UI grouped by feature; components/ui = shadcn primitives
data/                 static option lists (content types, icons, diagram types, landing copy, plans, sidebar links)
hooks/<domain>/       client hooks wrapping actions
lib/                  shared constants/config (content forms/colors/descriptions, storage, ai kinds+credits, paddle)
providers/            AppModalProvider (useModal), ToastProvider (useToast)
types/index.ts        all shared types
utils/                supabase clients, tryCatch, misc helpers (utils/fn.ts)
```

- **Server actions** live in `actions/<domain>/`. The pattern: `createServerSupabase()` → `auth.getUser()` → query scoped by `user_id` → `throw new Error(...)` on failure (user-facing message) → `revalidatePath(...)`. A `"use server"` file may only export async functions, so shared constants go in `lib/` (for example `lib/storage.ts`). Server-only helpers that aren't actions import `"server-only"` (`lib/ai/credits.ts`, `lib/paddle/server.ts`, `utils/supabase/admin.ts`).
- **Pages** (`app/app/*/page.tsx`) are async server components: call the action through `tryCatch` (`utils/tryCatch.ts`, returns `[data, error]`), render `<ErrorScreen>` on error, otherwise pass data to a `"use client"` container wrapped in `PageContainer` (title, description, optional action slot).
- **Client mutations** go through hooks in `hooks/<domain>/` that wrap `useTransition` with `useToast` and usually `closeModal`. Show the action's `error.message` in the toast when it's meaningful (plan limits, validation).
- **Modals**: `useModal().openModal(node)` renders the node once inside a blurred backdrop (Escape and backdrop click close it). Wrap content in `ModalContainer` (`size` = `xs | sm | md | lg`, `defaultPadding`). Props passed in are frozen for the modal's lifetime, and `revalidatePath` does not update them. If a modal changes data it displays, keep that data in local state (see `ShowContent`'s `fileUrls`). Confirmations use `ConfirmModal`.
- **List filters** are URL search params managed by `hooks/shared/useFilters.ts` (`handleFilter`, `hasFilter`, `clearFilter`, `clearAll`, `hasAnyFilter`, which uses `router.replace`); server pages read `searchParams`. Search inputs debounce with `hooks/shared/useDebounce.ts`.
- **Empty states** use `components/shared/EmptyState.tsx` (a filtered-empty variant with `compact`, and a first-use variant with an action).
- Shared UI: `PageButton`, `Input` (text/textarea), `DatePicker`, `SelectOptions`, `DropDownMenu`, `DateBadge`, `PriorityBadge`, `ContentBadge`, `LoadingScreen`, `ModalTitle`, `ModalActionButtons`.
- Prompts are template functions returning a string. They must say "return ONLY valid JSON" and describe the exact shape. Keep the student's language and never add outside information.

## Styling and lint notes

- Use theme tokens (`bg-surface`, `bg-surface-muted`, `border-border`, `text-muted-foreground`) rather than hardcoded grays. `.dark` tokens exist, but many components still hardcode light colors, and the root layout forces light mode.
- `--primary` is neon green `#35f527`. It works for fills, glows and rings, but has poor contrast as text or small icons. Helper classes: `.border-neon`, `.border-neon-no-hover`, `.text-neon`, `.text-neon-soft`; landing animations `.slide-up/-left/-right/-top`, `.fade-in`; utility `scrollbar-hide`.
- Per-type colors: hex in `data/colors/typeColors.ts` (inline styles), Tailwind class sets in `lib/contentcolors.ts` (`bg`, `dark`, `border`, `text`, `icon`, `solid`).
- The React 19 hooks lint rules are enforced, including `react-hooks/set-state-in-effect` (an error). Don't call `setState` directly inside an effect body: derive the value, key the component, or run the logic in an event handler.

## Known gaps and quirks

Check these before assuming a feature works:

- `generateDiagram` uploads to the `diagrams` bucket but builds the returned URL with `storage.from("content-files").getPublicUrl(...)`, so the stored `ai_output` points at the wrong bucket. Its key also lacks the random segment.
- `QuizComponent`'s Delete button has no `onClick` (the `useDeleteContent` result is unused).
- `ClassContent`'s dropdown options (View Details, Edit, View Notes, Share, Delete) are no-op stubs.
- `createClass` calls `revalidatePath("app/classes")` without the leading slash.
- `getMyClasses` interpolates the search term into `.or()` unquoted (unlike `getAllContents`), so commas or parentheses in a search break the filter.
- Unused code: `components/ai/AIOutput.tsx`, `components/contents/AIToolsPanel.tsx` + `data/noteModal/noteModalCards.ts`, `components/mermaid/MermaidComponent.tsx`, `ai/prompts/generateImagePrompt.ts`, `components/shared/DueDate.tsx`, `lib/kindcolors.ts`, `getFileUrl` in `utils/fn.ts`, and the `contents.status` column.
- Marketing copy (`data/settings/plans.ts`, landing pricing) mentions "AI OCR", which doesn't exist.
