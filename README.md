# Raaha — swipe-card prototype

Screen 3 of the Raaha case study — the check-in swipe deck. Mobile-first
gesture prototype. Visual polish comes in a later pass; this build exists to
nail the gesture feel.

## Run locally

```bash
npm install
npm run dev
```

Open on a phone (or Chrome devtools mobile at 390px) — `localhost:3000`
redirects to `/swipe`.

Requires Node 18+.

## Project shape

| Path | What's there |
|---|---|
| `src/app/swipe/page.tsx` | The route |
| `src/components/swipe/` | `SwipeCard`, `SwipeStack`, `ProgressBar`, `TerminalState` |
| `src/lib/physics.ts` | All gesture tunables |
| `src/lib/questions.ts` | The four swipe questions (canonical, from story-arc §5) |
| `src/lib/useReducedMotion.ts` | `prefers-reduced-motion` hook |
| `PHYSICS.md` | Human-readable guide to every physics constant |
| `tailwind.config.ts` | Design-system tokens from `/docs/raaha-design-system.md` |

## Tuning

Change numbers in [`src/lib/physics.ts`](src/lib/physics.ts). Never in
components. See [`PHYSICS.md`](./PHYSICS.md) for what each constant does and
which way to nudge it.

## What this build is not

No onboarding, no settings, no Screen 1/2/4/5, no live API wiring. On stack
completion the captured responses are `console.log`'d with the prefix
`RAAHA_SWIPE_COMPLETE:` and rendered as JSON in the terminal state for dev
inspection. The terminal state is a placeholder for where the Screen 4
restoration proposal will eventually render.

## Deploy

Vercel auto-detects this repo as Next.js 14 App Router — no config changes
needed. Point the project at the repo, ship.
