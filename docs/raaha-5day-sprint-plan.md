# Raaha Case Study — 5-Day Sprint Plan
**Candidate:** Bevin Mohabeer
**Brief:** GovAI / DGE AI Factory — Product Designer Case Study
**Submission:** Monday 27 April 2026

---

## Scope decisions (locked)

- **Language:** English-first build. Arabic switcher as a timeboxed UI feature, killable by Saturday 4pm if behind.
- **Build stack:** Claude Design → Claude Code handoff → Vercel deploy
- **Prototype access:** Live URL, mobile-tested (not a Figma click-through, not a Claude artifact)
- **AI in the prototype:** Live Anthropic API calls — not a hardcoded script
- **Process deliverable:** Annotated slide deck built in Claude Design, exported to PPTX
- **Screens in scope:** 5 maximum. Hold the line.

---

## The winning angle

Three things together, not any one alone:

1. **DCT insider POV** — you've worked inside Abu Dhabi government. Most submissions will build a generic wellbeing app. You build something that feels like it was designed by someone who's sat in those buildings.
2. **Anthropic's newest design-to-code pipeline** — Claude Design → Claude Code is the exact workflow Anthropic is promoting. On-narrative for a DGE AI Factory audience.
3. **Live AI inside the prototype** — judges tap it, it responds intelligently. Single biggest differentiator against the field.

**One-line framing for the deck:** *"Most wellbeing apps treat government employees like consumers. Raaha treats them like civil servants — with the constraints, rhythms, and responsibilities that implies."*

---

## Day 1 — Wed: Frame + de-risk

- [ ] **Claude Design spike (90 min).** Build one Raaha screen in both Claude Design and Claude Code. Compare. Confirm the split. *Test prompts below.*
- [ ] NotebookLM knowledge base: UAE National Wellbeing Strategy, Ma'an, DGE AI charter, MENA mental health literature, Abu Dhabi Government Employee Experience sources
- [ ] Problem narrowing with Claude chat: lock the specific moment-in-the-day
- [ ] Write 1-page concept brief: persona, moment, hypothesis, why AI (not just a chatbot)

## Day 2 — Thu: Design direction

- [ ] IA + key flows (5 screens max)
- [ ] AI behavior principles doc: what it knows / says / doesn't say / when it's silent / how it handles hierarchy, prayer times, Ramadan
- [ ] Design system setup in Claude Design (colors, type, components) — this is the guardrail that stops it freelancing
- [ ] First Claude Design passes on 2–3 screens
- [ ] Hero imagery as needed: Midjourney / Flux

## Day 3 — Fri: Build

- [ ] Claude Design: finalize all 5 screens
- [ ] Handoff to Claude Code (Next.js + Tailwind)
- [ ] Wire in Anthropic API for live AI responses — this is the thing that wins
- [ ] Vercel deploy, mobile-tested on actual phone
- [ ] Arabic switcher: stubbed UI only (toggle works, content swaps for 1 screen)

## Day 4 — Sat: Polish + AI behavior tuning

- [ ] Iterate system prompt until the AI feels culturally grounded. Budget the whole day.
- [ ] Edge cases: empty states, errors, AI refusals, privacy moments
- [ ] Arabic switcher: keep/kill decision by 4pm
- [ ] Demo script: the 3-minute tap-through you'd do live

## Day 5 — Sun: Process deliverable

- [ ] Build process deck in Claude Design
- [ ] Structure: Problem → Persona → Hypothesis → **AI workflow receipts** → Key decisions → Demo link → What's next
- [ ] Embed Claude Code / Claude Design / NotebookLM screenshots — the receipts section is the one judges will linger on
- [ ] Export to PPTX; capture screen recordings with Screen Studio / CleanShot X
- [ ] Draft submission email

## Day 6 — Mon: Submit

- [ ] Morning pass: fresh eyes on prototype, fix anything obvious
- [ ] Submit by midday UAE time

---

## Risks tracked

| Risk | Mitigation |
|---|---|
| Claude Design stability (research preview) | Claude Code is the fallback for prototype; day 1 spike confirms |
| Anthropic API latency inside prototype | Cache common responses; show a thoughtful loading state as a feature |
| Scope creep Saturday | Hold the line at 5 screens. No new features after Friday EOD. |
| Arabic feature slippage | Already scoped as killable ✓ |
| Design taste drift | Set up the design system in Claude Design on Day 2 before generating screens |

---

## Toolchain map

| Phase | Primary | Supporting |
|---|---|---|
| Research synthesis | NotebookLM | Claude chat |
| Problem framing | Claude chat | — |
| Visual direction | Claude Design | Midjourney / Flux |
| Prototype build | Claude Design → Claude Code | Cursor (if needed) |
| AI layer in prototype | Anthropic API | Claude Code |
| Deployment | Vercel | — |
| Process deck | Claude Design | Screen Studio / CleanShot X |
