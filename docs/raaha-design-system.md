# Raaha — Design System Foundations
**Day 2 artefact · constraints document, not a full system**
Candidate: Bevin Mohabeer | GovAI / DGE AI Factory | Submission: Mon 27 April 2026

---

## What this document is

A set of hard constraints to stop Claude Design drifting toward Headspace-adjacent wellness visuals when it generates screens. Not a complete design system. Enough structure that the five screens feel like they were designed for a G10 section head working inside an Abu Dhabi government building — not a consumer of a mindfulness app.

Set this up in Claude Design first, on Day 2, before generating any screens. The tokens are the guardrail.

---

## The aesthetic position

**Government-grade, not bureaucratic. Warm, not cute. Considered, not clinical.**

Raaha sits visually between two worlds it must not belong to. It is not a consumer wellness app — no pastel gradients, no rounded-everything, no soft pink/purple mood palette. It is not a government dashboard — no flat IBM-blue, no dense data tables, no institutional heaviness.

It is a tool a civil servant reaches for in a ten-minute window between meetings. The visual language has to read as operationally serious in two seconds, then warm up on closer inspection. Typography-led. Restrained in ornament. Silence as a compositional element.

---

## Reference products (aesthetic grounding)

Pick the *attribute* from each, not the whole look. These are triangulation points, not templates.

### 1. Linear
Steal: operational clarity, typography-first hierarchy, restraint with colour, confidence in white space. Linear proves that a tool can be warm without being soft, and serious without being sterile. This is the closest neighbour to Raaha's register.

### 2. Arc Browser
Steal: warmth inside a tool, small moments of character (micro-animations, considered accents), and the willingness to let the product have a point of view without drifting into lifestyle-branding. Arc is permission to be interesting without being decorative.

### 3. TAMM 4.0 (Abu Dhabi's flagship AI-native gov platform)
Steal: visual continuity with the client's own ecosystem. Raaha should look like it could live alongside TAMM without being a clone of it. Sandy/cream backgrounds, generous padding, a governmental seriousness softened by warmth. This is the credibility signal for DGE judges — the product inherits the visual language of the environment it belongs to.

Do not reference Headspace, Calm, Finch, Wysa, BetterUp, or any meditation/journaling app. Ever. Not even for "accessibility of the check-in pattern." The swipe mechanic is ours; the visual idiom is not theirs.

---

## Explicit rejections — what Raaha visually is NOT

| Anti-reference | Why it's wrong for Raaha |
|---|---|
| **Headspace** | Pastel purple/orange gradients, rounded mascot-adjacent illustration — reads as consumer wellness, which is exactly what Hamad's day has no room for. |
| **Calm** | Deep-blue meditation aesthetic, slow photographic backgrounds — it asks the user to *enter an app*, rather than use a tool. Wrong posture for a ten-minute window. |
| **Finch / Forest / Fabulous** | Gamification, streaks, pets, achievement states — collapses the product into exactly the habit-tracking trope the brief names as failure mode. |
| **Wysa / BetterUp / Woebot** | Therapeutic-clinical soft palette, avatar-led interaction — invokes the stigma design constraint we explicitly must avoid. |
| **Consumer gov portals (IBM-blue SAP look)** | Flat corporate blue, dense tables, typography subordinated to forms — dead-eyed institutional. The opposite of "designed by someone who sat in these buildings." |
| **UAE visual pastiche** | Geometric Islamic pattern backgrounds, gold Arabic calligraphy as ornament, desert silhouettes — culturally shallow, flags a designer who doesn't actually work here. |
| **AI-native neon** | Bright ChatGPT-green, Claude-orange gradients, chrome-reflective "intelligent" accents — collapses back into chatbot-aesthetic. Raaha is not a chatbot. |

---

## Colour palette

Warm-institutional base, one confident accent, a diagnostic gradient for the رَاحَة reading. Everything else is ink on paper.

### Base

| Token | Hex | Use |
|---|---|---|
| `bg.canvas` | `#F6F2EC` | Primary background — warm limestone, not pure white. Institutional warmth without beige fatigue. |
| `bg.surface` | `#FFFFFF` | Cards, inset surfaces. Pure white for contrast against the canvas. |
| `bg.surface.warm` | `#FBF7F1` | Secondary surface for inset blocks that need softening (e.g. artefact drafts on Screen 2). |
| `ink.primary` | `#1C1A16` | Body text. Warm black, not true black. Readable on canvas. |
| `ink.secondary` | `#5E574D` | Secondary text, metadata, timestamps. |
| `ink.tertiary` | `#938A7E` | Disabled, low-emphasis, placeholder. |
| `line.hairline` | `#E5DED3` | Dividers. Warm, never cool grey. |

### Accent

| Token | Hex | Use |
|---|---|---|
| `accent.primary` | `#2A5A4E` | Primary action, key UI moments, Raaha's voice markers. A deep muted teal-green — quiet confidence. Reads as considered, not playful. Not the national-flag green. |
| `accent.primary.soft` | `#E8EFEC` | Selected states, subtle backgrounds for primary-weighted components. |
| `accent.ink` | `#C9A96E` | Ceremonial accent — used sparingly for moments of warmth (the 17:10 close, the saved-item reference). Muted wheat/ochre, never metallic gold. |

### Semantic (functional states only)

| Token | Hex | Use |
|---|---|---|
| `state.confirm` | `#2A5A4E` | Uses `accent.primary`. No separate "success green." |
| `state.caution` | `#B85830` | Warm terracotta for attention. Never for wellbeing signals (no alarming the user about their own day). |
| `state.muted` | `#938A7E` | Dismissed, archived, low-emphasis. |

**No red. No bright green. No blue.** Red is alarming in a wellbeing tool. Bright green is achievement-industrial. Blue is generic government. Raaha opts out of all three.

### The رَاحَة reading gradient

The diagnostic gradient on Screen 1. Warm-tight (day is pressured) to cool-clear (day has space). Deliberately non-emotional — amber is not "bad," teal is not "good." The gradient describes *the shape of the day*, not *the quality of the person*.

| Stop | Hex | Meaning |
|---|---|---|
| `raaha.tight` | `#C17A3E` | Warm-tight. Desert at noon. The day is compressed. |
| `raaha.mid.warm` | `#D9B07C` | Softening. |
| `raaha.mid.cool` | `#A8BFB4` | Opening. |
| `raaha.clear` | `#7FA89E` | Cool-clear. Early morning sky. The day has room. |

Render as a smooth gradient, not stepped. Never label the stops "poor/fair/good." The reading is a shape, not a score.

---

## Typography

**One family, two scripts. Typography is the UI.**

### Families

- **Latin:** Google Sans Flex (variable font, humanist-technical, ships via Google Fonts).
- **Arabic:** Tajawal (Boutros Fonts, screen-optimised Arabic, strong pedigree in UAE digital product design).

Rationale: Google Sans Flex is a variable font — single file, smooth weight transitions, tool-forward register. Tajawal is the credibility pairing: it's the default Arabic in the UAE digital-product universe (TAMM-adjacent, Dubai Now uses the same family), so the typographic choice itself signals that the designer works inside this ecosystem. Both load from Google Fonts, which keeps procurement simple.

No serif. No display font. No rounded sans (Nunito, Poppins, Quicksand are all forbidden — consumer-wellness tells).

### Scale (mobile baseline 16px)

| Token | Size / Line | Weight | Use |
|---|---|---|---|
| `display` | 32 / 40 | 500 | The رَاحَة number on Screen 1. One instance per screen max. |
| `title` | 24 / 32 | 500 | Today-screen greeting and hero card headline. Tracking-tight; `[text-wrap:pretty]` to control orphans. One per card. |
| `heading` | 22 / 30 | 500 | Screen titles, moment anchors elsewhere in the flow. |
| `body.lg` | 18 / 28 | 400 | Raaha's voice. The read, the artefacts, the proposal. This is the hero size — Raaha speaks at body.lg because the voice *is* the product. |
| `body` | 16 / 24 | 400 | Standard UI. Up Next titles, banner titles. |
| `body.sm` | 14 / 20 | 400 (500 on buttons) | Inline button labels, the ReadingHero voice line in `accent.primary`. The bridge between body and caption. |
| `caption` | 13 / 18 | 400 | Timestamps, metadata, ambient signals. Locations, secondary lines on cards. |
| `caption.sm` | 12 / 16 | 400 | Header date/time strip on Today (e.g. "Tuesday · 14:18"). Use `tabular-nums`. |
| `micro` | 11 / 16 | 500 | All-caps section labels in tight contexts. `tracking-wider`. Used sparingly. |
| `eyebrow` | 12 / 16 | 500 | Card eyebrow / caption-row labels: TODAY IS, LOOPS CLOSED, UP NEXT, the Last-N-days subtitle, the legend (Wellbeing/Productivity). No tracking — the size carries the hierarchy. Replaces the earlier `micro` + `tracking-wider` pattern on these spots per Figma 0:8. |
| `nano` | 10 / 12 | 400 | Day-strip labels under the LoopsCard cells. Reserved for dense numeric strips; do not use elsewhere. |

Weights: 400 regular, 500 medium, 600 semibold. No 700 bold (too shouty for this register). No 300 light (too delicate — the product should feel grounded).

### Arabic handling

- Arabic script runs in Tajawal, never transliterated into Latin ("As-salamu alaykum" is forbidden — use the script or skip).
- RTL mirroring is a Day 3 UI concern, not a Day 2 tokens concern. The switcher is timeboxed per the sprint plan.
- Tajawal's x-height runs slightly taller than Google Sans Flex at matched sizes. In mixed-script lines, size Arabic glyphs 1–2px smaller than the Latin equivalent to keep optical balance.

---

## Spacing and layout

4px base grid (an 8px rhythm with 4px half-steps for typographic micro-adjustments). Breathing room over density.

| Token | Value | Use |
|---|---|---|
| `space.1` | 4px | Half-step for tight stacks: dot gaps inside a LoopCell, line spacing between a title and its meta line. |
| `space.2` | 8px | Tight internal padding, icon-to-label spacing, button vertical padding. |
| `space.3` | 12px | Inline spacing between related elements, button horizontal padding. |
| `space.4` | 16px | Standard component padding (cards). |
| `space.5` | 20px | Screen edge padding on Today (`px-5`). |
| `space.6` | 24px | Major separation between unrelated blocks (gap between the cards on Today). |
| `space.7` | 28px | Hairline inter-section step where 24 reads tight and 32 reads loose. Used sparingly. |
| `space.8` | 32px | Section-level vertical rhythm. |
| `space.10` | 40px | Reserved for inter-screen breathing room. |
| `space.12` | 48px | Hero separation (e.g. the رَاحَة number from the 14-day strip). |

#### Typographic micro-steps

Some optical adjustments fall *between* spacing tokens. Allow the following values inside a single component, but never as the gap between unrelated blocks:

- **6px** — between a `caption.sm` date and the title beneath it (header), between a `micro` label and the headline beneath it (card eyebrow), between rows of dots in the LoopsCard.
- **10px** — internal stacking inside fixed-height skeleton blocks where the loaded state needs 6px + a 4px optical correction.

Anything below 4px or off-pattern needs justification in a code comment.

### Layout principles

- **Mobile-first.** Design at 390px width (iPhone 15 Pro viewport). Desktop is a courtesy, not a target.
- **Single-column.** No side-by-side content blocks on mobile. Vertical flow only.
- **Typography-led, not icon-led.** Icons support text; they never replace it. No icon-only buttons except for navigation.
- **Silence is a design element.** At least 30% of any screen should be empty. Raaha does not fill the page because it can.
- **One primary action per screen.** Every screen in the five-screen flow has one thing the user does. Menus are a sign of lost narrative.

### Corner radii

- `radius.sm` 6px — inline inputs, chips.
- `radius.md` 12px — cards, artefact blocks, the primary voice-of-Raaha container.
- `radius.lg` 20px — the swipe prompt container on Screen 3.
- **No fully rounded pills for content** (24px+ radius signals consumer-app playfulness). Rounded-full *only* for micro-controls like toggle states.

### Shadows

Minimal. One elevation step.

- `shadow.sm`: `0 1px 2px rgba(28, 26, 22, 0.04)` — hairline separation for stacked cards.
- `shadow.md`: `0 4px 12px rgba(28, 26, 22, 0.06)` — the artefact block on Screen 2 when it streams in. Used once per screen max.

No glassmorphism. No colourful soft-shadow glow effects.

---

## Component posture

Not a component library — posture notes so Claude Design generates things in the right register.

- **Buttons:** rectangular with `radius.sm` (6px) for every primary CTA on the Today / Swipe screens — both inline (Up Next "Check in", banner "Check in") and full-width (ReadingHero "Create space for yourself", terminal "Continue", swipe "Send"). The earlier asymmetry (rounded-md for full-width) was dropped per Figma 0:8 / 15:102 — one radius across the surface keeps button language coherent. Primary uses `accent.primary` fill, white text at `body` (16/24) weight 500, padding `space.3` × `space.2`. Secondary is outlined in `ink.primary` on `bg.canvas`. No gradients, no shadow.
- **Today-screen cards:** `bg.surface` with `radius.md`, `space.4` padding, `shadow.sm`. Eyebrow label in `eyebrow` (12/16, weight 500, `ink.tertiary`) at the top — no `tracking-wider`. Section heading or title sits beneath the eyebrow with `space.2` separation. Body content fills the remaining space; metadata in `caption` `ink.secondary`.
- **ReadingHero card** (Today's reading): `bg.surface` `radius.md`, `space.4` padding, `shadow.sm`. Internal `gap-4` between (eyebrow + headline + voice) inner block and the full-width primary CTA. The CTA reads "Check in" — the same single label every CTA on the home uses (banner, Up Next, ReadingHero), pre- and post-completion. Consistency over voice variants here so the user always knows the same affordance.
- **Banner / "next thing" card** (UpcomingMeetingCard): inverted treatment — `bg.accent-primary-soft` fill, `border accent.primary`, `radius.md`. Top "in N minutes" line in `eyebrow` `raaha.tight` (warm-tight, not state.caution — closeness is not alarm). Sits at the top of the stack only after the loaded state settles (see §Motion below).
- **Loops legend** (LoopsCard): two items, gap-4. **Wellbeing** uses a filled circle in `raaha.clear` (cool teal, the "day has space" stop of the gauge gradient). **Productivity** uses a hollow diamond in `raaha.mid.warm` (warm wheat). Internal type stays `op`/`wb` for data-layer back-compat; the displayed label is "Productivity" not "Operational" per Figma 0:8.
- **Up Next timeline rail** (UpNextWidget): in-row 1px solid line under each time label (`flex-1` so it fills the rest of the row), with a separate 24px-tall standalone spacer between rows that carries its own 1px line aligned to the time column's centre. The standalone spacers are what create the visible gap between events while keeping the rail visually unbroken from one row's connector to the next. Last row has no connector. Row content carries zero padding — all spacing lives in the spacers, per Figma 3:67.
- **Swipe cards (Screen 3):** full-width, generous vertical padding (`space.8`), binary options at the bottom with equal visual weight. No "correct" answer colour-coded.
- **Artefact blocks (Screen 2):** `bg.surface.warm` card with `radius.md`, left-aligned text, sender/recipient label in `caption` above. Feels like reading a draft, not a template.
- **Ambient signal lines** (e.g. "The Coffee Shop is less busy than usual"): `caption` size, italic, `ink.secondary`. Sits under the proposal — never competes with it.
- **Voice-of-Raaha text blocks:** `body.lg`, `ink.primary`, generous `line-height`. No icon, no avatar, no "Raaha says:" label. The voice is the presence. The Today ReadingHero "voice" line is the one variant — `body.sm` in `accent.primary` because it sits under a `title` headline and acts as a hairline echo, not the hero voice itself.

### Today-screen composition

The Home / Today screen is the canonical reference layout for cards-in-stack:

- **Page shell:** `mx-auto max-w-mobile bg.canvas px-5 pb-8 pt-5`.
- **Header:** `caption.sm` date in `ink.secondary` → 6px → `title` greeting in `ink.primary`. Followed by `space.6`.
- **Stack:** `flex flex-col gap-6`. Card order is fixed: optional banner → ReadingHero → LoopsCard → UpNextWidget. The banner enters last, on a height-animated `AnimatePresence` mount, so the stack pushes down rather than popping.
- **Skeletons:** every loaded element has a height-locked skeleton equivalent so layout does not shift on data arrival. Skeleton fills are a horizontal shimmer over `line.hairline` (#E5DED3 with a 50% mid-stop). One animation, one duration: 1.4s ease-in-out.

---

## Handoff notes for Claude Design

When setting up the design system in Claude Design on Day 2:

1. **Seed the tokens first.** Colour, type, spacing, radius. Before generating any screen.
2. **Paste the reference-product list into the design brief** — Linear, Arc, TAMM. Ban Headspace/Calm/Finch/Wysa by name. Claude Design will drift toward them by default on a "wellbeing app" prompt.
3. **Lead prompts with register, not features.** "Generate a screen where Raaha reads Hamad's day — operational, typography-led, warm-institutional — in the register of Linear's inbox view" produces better output than "generate a wellbeing home screen."
4. **Reject first outputs that include:** rounded everything, gradient backgrounds, illustrated mascots, purple/teal gradient accents, motivational copy, emoji. Regenerate with an explicit negative.
5. **Hold the line on five screens.** If Claude Design proposes settings, onboarding, or a profile screen, reject — those live in the backlog, not the case study.

The goal for Day 2: a design system inside Claude Design so locked that a judge who takes a screenshot of Screen 1 and a screenshot of Screen 4 can see they are from the same product, in the same week, by the same hand.

---

## What this document deliberately does not include

- Iconography system (use Lucide or Phosphor defaults — not the design bet)
- Motion specification (keep it minimal — one ease curve, one 200ms duration, done)
- Full component library specs (would take 4 hours, not 45 minutes)
- Illustration style (Raaha does not use illustrations — this is a constraint, not a gap)
- Dark mode (shipped product concern, not a case study one)
- Accessibility audit (will pass WCAG AA through the palette contrast ratios above; formal audit is post-MVP)

If any of these become blocking during Day 3 build, resolve them inline, then come back and capture in a v2 of this document on Day 5 if time permits.
