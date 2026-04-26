# Raaha — Design System Foundations
*Visual constraints for Claude Design. 45-minute benchmark, not a full system.*

---

## What This Is For

To prevent Claude from defaulting to Headspace-adjacent wellness aesthetics (lavender gradients, rounded blob shapes, meditation-app pastels) when generating UI for Raaha. These constraints define the aesthetic envelope, not the full component library.

---

## Reference Products (Aesthetic Grounding)

**Primary:** Open (mindfulness studio) — full-bleed dark photography, near-black backgrounds, sparse white type, geometric line art. Feels expensive and cinematic, not cozy.

**Secondary:** WHOOP — deep charcoal/near-black UI, sparing lime-green accent, condensed all-caps labels, performance-data density. Makes data feel serious, not clinical.

**Tertiary:** MacroFactor — white-dominant light mode, high-contrast black typography, evidence-first tone. Clean without being sterile; shows numbers are the feature.

---

## Colour Palette Direction

### Dark Mode (Primary)
| Role | Hex | Notes |
|------|-----|-------|
| Background | #0C0C0C | Near-black, not pure black |
| Surface | #161616 | Cards, panels |
| Surface elevated | #1F1F1F | Modals, overlays |
| Border | #2A2A2A | Dividers, input outlines |
| Text primary | #F5F5F0 | Off-white, not stark white |
| Text secondary | #8A8A85 | Metadata, labels |
| Text tertiary | #555552 | Disabled, timestamps |
| Accent | #C8B89A | Warm sand — one restrained warm note |
| Accent interactive | #E8DDD0 | Hover state of above |
| Data positive | #7DBE8C | Muted sage green (not neon) |
| Data negative | #C47B6A | Terracotta (not red-alert red) |
| Data neutral | #8090A8 | Slate blue for trend lines |

### Light Mode (Secondary)
| Role | Hex | Notes |
|------|-----|-------|
| Background | #F8F7F4 | Warm white, not pure white |
| Surface | #FFFFFF | Cards only |
| Surface elevated | #F0EEE8 | Nested panels |
| Border | #E0DDD6 | Hairline borders |
| Text primary | #1A1A18 | Near-black |
| Text secondary | #6B6B65 | Secondary labels |
| Accent | #8A7560 | Same warmth, darker value |

### Colour Philosophy
Draw from: TIDE's greyed-out muted tones, Open's near-black-with-warm-speck approach, Stoic's near-monochrome with single purple accent discipline.

The palette has one warm accent. Everything else is neutral. No teal. No lavender. No coral gradients. No sunrise palettes.

---

## Typography Direction

### Typeface Families

**Primary (UI + Display):** Inter or **Geist** — neutral grotesque, geometric, high legibility at small sizes. Geist preferred for its slightly tighter metrics and contemporary feel.

**Secondary (Editorial / Quotes / Long-form):** A humanist serif at display sizes only — **DM Serif Display** or **Fraunces** (variable, optically expressive at large sizes). Use sparingly for pulled quotes, daily insights, onboarding headlines. Seen in TIDE and Stoic's emotional content.

**Monospace (Data / Metrics):** **Geist Mono** or **JetBrains Mono** — for numeric readouts, health metrics, streaks. Numbers need tabular figures and fixed width. Seen in WHOOP and MacroFactor.

**Avoid:** Any rounded display face (Nunito, Poppins, Quicksand). Any script or handwritten font. SF Pro at sizes that trigger default iOS feel.

### Scale Approach

Modular scale ratio: **1.25 (Major Third)** — compact enough for data density, wide enough for clear hierarchy.
xs:   11px / 0.6875rem  — timestamps, status labels
sm:   13px / 0.8125rem  — secondary body, metadata
base: 16px / 1rem        — primary body
md:   20px / 1.25rem    — emphasized body, card titles
lg:   25px / 1.5625rem  — section headers
xl:   32px / 2rem        — screen titles
2xl:  40px / 2.5rem     — large numeric readouts
3xl:  56px / 3.5rem     — hero metrics (daily score, etc.)

**Line height:** 1.4 for body, 1.1 for display/headings (tight, editorial).
**Letter spacing:** -0.02em on headings ≥20px. +0.08em on ALL-CAPS labels only.
**Weight:** Regular (400) for body. Medium (500) for UI labels. Semibold (600) for data callouts. Bold (700) for display only — use restraint.

---

## Spacing and Layout Principles

### Base Unit
**4px base grid.** All spacing values are multiples of 4.

Common tokens:
- `space-1`: 4px — icon gaps, tight inline
- `space-2`: 8px — component internal padding
- `space-3`: 12px — between label and value
- `space-4`: 16px — standard card padding
- `space-6`: 24px — between card sections
- `space-8`: 32px — between screen sections
- `space-12`: 48px — screen-level vertical rhythm
- `space-16`: 64px — hero section breathing room

### Layout Principles (from benchmark analysis)

**Breathing room over density.** Apple Health stacks cards tightly; WHOOP and Open use generous negative space. Raaha should default closer to Open — content needs room to settle.

**Left-aligned everything.** No centered body text. Centered type only on hero/splash screens and large numeric readouts. MacroFactor and Stoic both center display numbers but left-align all supporting copy.

**Full-bleed sections over boxed cards.** Prefer edge-to-edge sections with internal padding (Open, TIDE approach) over rounded-card grids (Apple Health approach). Cards exist but sparingly.

**Data density when the context is data.** MacroFactor and WHOOP show: when the user is in tracking mode, pack the information in. Don't pad metrics screens like they're onboarding. Density = confidence.

**Max content width (web/responsive):** 640px for reading content, 960px for dashboard layouts. Never full-bleed text at wide viewports.

### Border Radius
- Components (buttons, inputs, chips): `8px`
- Cards: `12px`
- Modals / sheets: `16px` top corners only
- Avatar / circular elements: `9999px`
- **Not:** 24px+ "squircle" radii on content cards — that reads as Headspace.

### Motion (directional constraint)
Keep transitions under 200ms for UI state changes (tap, toggle). Reserve 300-400ms for screen transitions. No bouncy spring physics. Ease-out preferred. Open's approach: slow fade-in for content, snap-out for dismissal.

---

## Iconography Direction

Line icons, 1.5px stroke, rounded joins. 24px base grid. Heroicons or Phosphor (regular weight) as starting point. No filled/solid icons in navigation — filled state only for selected/active. No 3D or illustrated icons.

---

## Explicit Rejections — What Raaha Is Not

### Visually
- ❌ **Lavender, lilac, periwinkle** — Headspace's colour. Implies ambient meditation product.
- ❌ **Gradient blobs and aurora backgrounds** — Calm's aesthetic. Too passive, too sleep-product.
- ❌ **Rounded sans-serif display faces** (Nunito, Poppins, Quicksand) — signal approachability to the point of childishness.
- ❌ **Illustrated characters or mascots** — Stoic uses a small bird icon; Raaha should not use any humanoid or animal illustration in UI.
- ❌ **Sunrise/sunset gradients as primary backgrounds** — TIDE uses photographic versions tastefully; gradient-only is instant wellness-app cliché.
- ❌ **Teal or mint as accent** — overused across health apps (Apple Health, various competitors). Too clinical-cheerful.
- ❌ **Nature emoji or leaf motifs as UI decoration** — the "wellness leaf" is as clichéd as the "fintech line chart going up."
- ❌ **Sparkle / star glyphs for AI features** — every AI product does this. Stoic does it. Avoid.
- ❌ **Card-heavy grid layouts with heavy drop shadows** — reads as early 2020s health dashboard.

### Tonally (affects visual decisions)
- ❌ Not aspirational-coach energy (WHOOP's "unlock yourself" posture is fine for performance, not for Raaha's tone)
- ❌ Not clinical/medical — Apple Health's neutral grey is right-directionally but too cold
- ❌ Not mindfulness-app softness — no content that implies the user needs to relax, breathe, and slow down

### The Line to Hold
Open is the closest aesthetic cousin and the right ceiling of moodiness. MacroFactor is the right floor of utility density. Raaha sits between them: a product that feels like it was designed by someone who reads research papers and has good taste, not someone who uses Calm.

---

## Quick-Check Test

Before shipping any screen, ask:
1. Could this be mistaken for a Headspace or Calm screenshot? → If yes, strip the warmth and add precision.
2. Does it have more than one accent colour in active use? → Reduce to one.
3. Is the type set in a rounded sans? → Replace.
4. Does it use a gradient as a primary background surface? → Replace with flat near-black or off-white.
5. Is there any illustration style that implies "wellness"? → Remove.