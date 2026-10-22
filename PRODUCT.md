# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Students of any level (high school through university) managing several classes at once. They take notes, track homework and reminders, and want AI to clean up, summarize and quiz them on their own material.

## Product Purpose

Classly is an AI study app. Users create classes (name, icon, color, weekly schedule), then create contents inside them: notes (AI proofread), summaries, reminders, homework, quizzes and diagrams, each backed by an AI call, with file attachments. They browse everything on All Contents, see sessions and due dates on a Calendar, and manage plan and AI usage in Settings. Success: a student opens Classly to capture and review class material faster than with a plain notes app.

## Positioning

Study material stays organized per class and every item can be run through AI (proofread, summarize, quiz, diagram) without leaving the class.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind v4, shadcn components in `components/ui/`; redesign happens in this stack.
- Plans: Starter (free, limited AI) and Pro ($12/mo via Paddle). Quiz and diagram are Pro-locked on Starter.
- Routes in scope: `/` landing, `/app/classes`, `/app/class/[id]`, `/app/contents`, `/app/calendar`, `/app/settings`, plus modals. All function and data flow must keep working.

## Brand Commitments

- Keep the Sora typeface, the Classly name and logo, and existing copy.
- The current neon green and general look are not binding; free to replace colors and visual identity.

## Evidence on Hand

Landing content in `data/landing/`. Testimonials and pricing copy exist in the repo; do not invent new customers or claims.

## Product Principles

- Per-class organization is the spine of the product.
- AI is a tool inside each content, never a separate chat surface.
- Fast capture and scanning beat decoration in the app.
- Limits and plan status stay visible and honest.
