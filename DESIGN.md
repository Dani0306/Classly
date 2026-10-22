---
name: Classly
description: An AI study app drawn as a charcoal study wall covered in fluorescent paper notes.
colors:
  board: "#22252b"
  board-surface: "#2b2f36"
  board-surface-muted: "#30343b"
  board-border: "#3d414a"
  board-muted-text: "#b4b8c0"
  note-yellow: "#ffe94a"
  note-pink: "#ff6fb5"
  note-blue: "#49c6ff"
  note-lime: "#a8f05a"
  note-paper: "#f4f4f1"
  ink: "#17181c"
  ink-hover: "#2c2e35"
  paper-surface: "#fbfbf8"
  paper-surface-muted: "#ebebe6"
  paper-border: "#d6d6cf"
  paper-muted-text: "#5b5d63"
  highlight-soft: "#fff6b8"
  focus-ring-paper: "#1f6feb"
  focus-ring-board: "#49c6ff"
typography:
  display:
    fontFamily: "Sora, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 5.75rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  page-title:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Sora, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
rounded:
  note: "3px"
  avatar: "9999px"
spacing:
  note-sm: "20px"
  note-md: "24px"
  note-lg: "32px"
  wall-gap-x: "24px"
  wall-gap-y: "32px"
  section: "128px"
  page-gutter: "20px"
  page-gutter-lg: "40px"
components:
  button-primary:
    backgroundColor: "{colors.note-lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.note}"
    padding: "10px 16px"
    typography: "{typography.label}"
  button-primary-lg:
    backgroundColor: "{colors.note-lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.note}"
    padding: "16px 24px"
  button-secondary:
    backgroundColor: "{colors.note-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.note}"
    padding: "10px 16px"
  note-card:
    backgroundColor: "{colors.note-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.note}"
    padding: "{spacing.note-sm}"
  note-card-featured:
    backgroundColor: "{colors.note-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.note}"
    padding: "{spacing.note-lg}"
  nav-item:
    backgroundColor: "{colors.board}"
    textColor: "{colors.board-muted-text}"
    rounded: "{rounded.note}"
    padding: "10px 14px"
  nav-item-active:
    backgroundColor: "{colors.note-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.note}"
    padding: "10px 14px"
---

# Design System: Classly

## Overview

**Creative North Star: "The Sticky Wall"**

Every piece of study material is a paper note pinned to a dark study wall. The ground is a charcoal felt board with a faint dot texture; on it sit fluorescent sticky notes in canary, pink, sky, lime and plain paper, each held up by a strip of translucent tape and casting a soft, dropped shadow. AI is the act of turning a scribbled note into a clean one, so the mechanism itself is drawn as notes.

The system runs on two token scopes, not two themes. The wall (`.board`) reads light-on-charcoal for anything set directly on it: headings, nav links, muted copy. Every note (`.note`, `.paper`, and `:root` by default) resets the same tokens back to ink on paper, so a component dropped onto a note automatically reads dark. Components never ask which surface they are on; the scope answers for them.

Notes rest slightly crooked and straighten when picked up. On the landing the tilts are expressive (up to about 3deg); in the app they shrink to under 1deg so a grid of notes still scans as a grid.

**Key Characteristics:**
- Charcoal board ground, fluorescent paper notes, ink text on every note.
- One typeface, Sora, carried by weight: 800 for headlines, 700 for titles, 400 for body.
- Near-square paper corners (3px) on every note, button and chip.
- Tape strips, soft drop shadows and small rotations are the native depth language.
- Lime marks the primary action; plain paper marks everything secondary.

## Colors

A dark, desaturated wall with four saturated paper colors and one ink; color comes from the paper, never from text.

### Primary
- **Lime Note** (note-lime): the primary-action paper. Every main button (Start For Free, Get Started, Save) is a lime note. Hover lightens it slightly.

### Secondary
- **Canary Note** (note-yellow): the "you are here" and "this one matters" paper: the active sidebar link, the featured pricing plan, the first hero headline note. Also the highlighter swipe behind key phrases and the text-selection color.
- **Hot Pink Note** (note-pink): a second expressive paper for display notes (the "into mastery" hero note) and quiz tape.

### Tertiary
- **Sky Note** (note-blue): the "your raw note" paper in the hero mechanism, summary tape, and the focus ring on the wall.

### Neutral
- **Charcoal Board** (board): the page ground and sidebar, with a 6px dot texture at 4% white.
- **Board Surface / Muted / Border** (board-surface, board-surface-muted, board-border): the rare controls that sit directly on the wall (the sidebar toggle, hover fills on nav links).
- **Board Muted Text** (board-muted-text): secondary copy and inactive nav links on the wall.
- **Plain Paper** (note-paper): the default note and secondary-button paper.
- **Ink** (ink): all text and icons on every note, whatever its paper color.
- **Paper Surface / Muted / Border / Muted Text**: inputs, hover fills and dividers inside notes and modals. Inside notes, dividers are usually ink at 15% opacity.

### Named Rules
**The Ink On Paper Rule.** Text on a note is always ink. Paper colors are surfaces, not type: no bright text on paper and no bright running text on the board. The one built exception is a small ink tag carrying canary letters (the "Most popular" pricing tag).

**The Lime Means Go Rule.** Lime paper is reserved for the primary action. Use it once per decision point; everything else is plain paper.

**The Semantic Green Exception.** Correct answers, completed homework and low priority keep conventional greens (emerald/green), with reds for wrong and destructive. They mark state, not brand, and stay distinct from lime.

**The Sheet Variable Rule.** A note's paper color is set through `--sheet` (via the yellow, pink, blue and lime paper classes or an inline style), never through a `--note` variable. Tailwind v4 drops `--note:` declarations because they collide with the `note-*` theme color namespace.

## Typography

**Display Font:** Sora (with system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Sora
**Label/Mono Font:** Sora; numbers use tabular figures where they line up (prices, usage).

**Character:** A single geometric sans doing all the work through weight and tracking. Headlines are heavy and tightly tracked, like marker on paper; body copy is open and relaxed.

### Hierarchy
- **Display** (800, clamp(2.5rem, 7vw, 5.75rem), 0.95): landing headline only, written on notes.
- **Headline** (800, 2.25rem rising to 3rem at md, -0.03em): landing section headings, set on the wall.
- **Page Title** (700, 1.875rem, tight tracking): app page headers.
- **Title** (700, 1rem to 1.25rem, tight tracking): note and card titles.
- **Body** (400, 15 to 16px, 1.625): note body and descriptions; subcopy notes cap near 24rem wide.
- **Label** (600, 12px): buttons, type badges, metadata.

### Named Rules
**The Weight Not Face Rule.** Hierarchy comes from Sora's weight and tracking alone. Do not introduce a second family.

## Layout

The landing is a 12-column grid inside a 1280px container with 20px gutters (40px at lg); sections are separated by 112 to 128px. Notes are allowed to overlap and break the grid (the two hero headline notes overlap by 12 to 24px).

The app is a fixed 280px charcoal sidebar beside a scrolling main area padded 20px (32px at md). On mobile the sidebar slides over a 50% black backdrop. Collections of notes are flex-wrapped "walls" with fixed-width notes (280px for classes, 340px for contents), 24px horizontal and 32px vertical gaps so tape strips have room. Walls center on mobile and left-align from md.

## Elevation & Depth

Depth is physical: notes are paper resting on a board. Every note carries a hairline contact shadow plus a long soft drop beneath it; picking a note up deepens the drop. Tape strips add a second, tiny shadow. Nothing on the wall itself is elevated.

### Shadow Vocabulary
- **Note at rest** (`box-shadow: 0 1px 0 rgba(0,0,0,0.14), 0 18px 28px -16px rgba(0,0,0,0.55)`): every note and sheet.
- **Note lifted** (`box-shadow: 0 1px 0 rgba(0,0,0,0.14), 0 26px 34px -18px rgba(0,0,0,0.6)`): interactive notes on hover.
- **Button note** (`box-shadow: 0 1px 0 rgba(0,0,0,0.14), 0 10px 18px -10px rgba(0,0,0,0.5)`): paper buttons; removed when disabled.
- **Tape** (`box-shadow: 0 1px 2px rgba(0,0,0,0.12)`): the tape strip, 64 by 20px, rotated -2deg, 42% white by default or tinted with the class or content-type color at about 85% opacity.

### Named Rules
**The Pick It Up Rule.** An interactive note rests at its tilt and, on hover (fine pointers only) or keyboard focus, straightens to 0deg, rises 3px and deepens its shadow over 220ms. This is the system's signature interaction.

**The Scannable Wall Rule.** In grids, tilts cycle through -0.7, 0.5, -0.3 and 0.8deg. Larger rotations (1 to 3deg) are for single expressive notes on the landing.

## Shapes

Paper corners: 3px on every note, button, nav item, icon tile and tag. The only round shapes are avatars and small status pills. Notes are rectangles with no outlines; edges come from paper color against the board, not borders. Secondary paper buttons add a 1px ink border at 15% opacity so they read against plain-paper notes.

## Components

### Buttons
A small paper note you press.
- **Shape:** paper corner (3px).
- **Primary:** lime paper, ink text, 12px semibold, 10px by 16px (16px by 24px at lg, 14px text), button-note shadow.
- **Secondary:** plain paper with a 15% ink hairline; hover goes to white.
- **Hover / Focus / Press:** 160ms transitions; press scales to 0.97 instantly; focus shows a 2px ring offset 2px (blue on paper, sky on the wall).
- **Disabled:** paper at 60%, ink at 50%, no shadow.

### Cards / Containers
Every card is a note.
- **Corner Style:** 3px.
- **Background:** plain paper by default; canary for featured; tape tinted by the class color or the content-type color.
- **Shadow Strategy:** note at rest, lifted on hover (see Elevation).
- **Border:** none.
- **Internal Padding:** 20px (classes, contents), 24px at md, 28 to 32px for landing feature, testimonial and pricing notes; extra top padding (24 to 28px) clears the tape.

### Navigation
- **App sidebar:** on the board. Inactive links are muted light text with a board-surface hover fill. The active link becomes a canary note rotated -1deg with ink text and semibold weight.
- **Landing header:** sticky, on the board, with three muted text links and two paper buttons (Sign In paper, Get Started lime). Mobile opens a 288px board drawer from the right.

### Highlighter
A canary swipe behind a phrase, covering the lower 56 to 90% of the line box and cloning across line breaks. Used for the words AI made clear.

### Motion
- **Drop-in** (640ms, ease-out cubic-bezier(0.23, 1, 0.32, 1), 450ms delay): the one authored landing moment; the AI summary note falls onto the wall from -18px and -7deg.
- **Reveal** (520ms, ease-out): landing sections rise 12px once scrolled into view. Content is visible without it.
- **Reduced motion:** drop-in and reveals become a 200ms fade; tilts and the pick-up transform are removed entirely.

## Do's and Don'ts

### Do:
- **Do** put every piece of content on a note, and put notes on the board.
- **Do** let the scope set the colors: wall content inside the board scope, note content inside a note.
- **Do** set note color with `--sheet` or the paper classes, and tape color with `--tape`.
- **Do** use lime paper for the one primary action and plain paper for the rest.
- **Do** keep app tilts under 1deg and let them straighten on hover and focus.
- **Do** keep greens and reds for correct/done and wrong/destructive states.
- **Do** strip rotation and entrance motion under reduced motion.

### Don't:
- **Don't** set lime, pink, sky or canary type on paper notes or as running text on the board.
- **Don't** declare a `--note` custom property; Tailwind v4 drops it.
- **Don't** round notes beyond 3px or give them outline borders.
- **Don't** add a second landing entrance moment; drop-in is the only authored one.
- **Don't** use lime for state; correct and done stay semantic green.
