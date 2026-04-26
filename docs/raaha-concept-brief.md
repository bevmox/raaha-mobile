# Raaha — Concept Brief
**One page. Day 1 closing deliverable.**
Candidate: Bevin Mohabeer | GovAI / DGE AI Factory | Submission: Mon 27 April 2026

---

## Product

**Raaha** (راحة) is an AI companion for Abu Dhabi government employees that produces rest — ease, peace of mind, tranquility — inside the working day. It clears operational weight from the employee's path, then offers restoration shaped like their life.

## Persona

**Hamad Al Mazrouei, Grade 10 Section Head, Department of Government Enablement.** Team of eleven. Six years in. Owns his own deliverables and — informally — the welfare of his team. Sits at the intersection of every major stressor in the evidence corpus: manager tension, burnout risk, "push through" culture, inability to switch off. Middle management is the largest layer of Abu Dhabi government by headcount and the most under-served by current wellbeing provision.

## Moment

**Tuesday, late April, post-Ramadan catch-up week.** Two beats:

- **14:20 — between meetings.** Hamad has just come out of a 1:1 that didn't close. Team stand-up in ten minutes. Four meetings behind him, one date and half a sandwich since 11:40, chest tight.
- **17:10 — end of day.** Laptop half-closed. About to decide whether to open the inbox one more time before leaving.

## Hypothesis

*If AI can read the employee's day in real time, remove the operational weight that blocks rest, offer a contextual restorative act inside the space it created, and remember what it helped with long enough to close the loop — then wellbeing stops being something the employee has to fit in, and becomes what's left over when friction is removed and restoration is chosen.*

## Why AI — not a chatbot, not a content library

Raaha does five things no existing wellbeing infrastructure can do:

1. **Real-time synthesis** across calendar, comms, and context — the first sentence only Raaha could say.
2. **Multi-artefact orchestration** — moves a meeting, drafts two messages in different registers, in sixty seconds.
3. **Adaptive restorative prompting** — swipe-based check-in with prompts generated live from what the day contained. Not a form.
4. **Context-carrying across hours** — opens a loop at 14:20, closes it at 17:10. Three-hour memory.
5. **Register-tuned generative voice** — Arabic salaam in the team note, English to Reem, ceremonial-warm-operational throughout.

Remove AI and Raaha becomes a calendar app with a rescheduling button, a message template library, a journaling form, and a notification. That product exists and doesn't win a case study at DGE AI Factory. **AI is the only reason Raaha is materially different from what Hamad has today.**

## The two-layer architecture

**Layer 1 — Orchestration creates the space.** Raaha reads the day, identifies unfinished operational weight, proposes actions, produces the artefacts. Meeting moved. Delay note sent. Close-the-loop message sent. Six minutes back, one loop cleared.

**Layer 2 — Restoration inhabits the space.** Raaha asks — via swipe, two seconds per input — how the morning landed, whether the user could eat, whether reshaping the 3pm is on the table. Three binary signals route deterministically to one of five outcomes: move the 1:1 to the Coffee Shop, a ten-minute snack at the Coffee Shop, move the 1:1 to the Quiet Lounge, a ten-minute Quiet Break (walk outside or Quiet Lounge — user picks inline), or Stand Down if the user is carrying weight and closing doors. Chosen, not imposed. When the user signals "leave me alone," Raaha does.

**Layer 3 — Memory closes the loop.** At 17:10, Raaha returns with a receipt: the message to Reem landed, the afternoon's restoration helped, the day's work landed. Affirming close, not permission — *"Good work today."*

## Five screens

1. **14:20 — the read** (pattern surfaced)
2. **14:22 — the artefacts** (meeting moved, messages drafted live)
3. **14:24 — the swipe check-in** (three contextual prompts, deterministic routing)
4. **14:26 — the restorative act** (one of five outcomes — reshape, snack, quiet break, or stand down)
5. **17:10 — the close** (receipt + affirming close)

## Why this, for a civil servant

*"Most wellbeing apps ask employees to make time for rest. Raaha makes the time, then offers rest — chosen, specific, two minutes long — inside the space it cleared."*

The brief names two failures: nothing today feels personal, nothing fits into the actual day. Raaha answers both. **Personal** — because it reads Hamad's specific Tuesday, not a persona of a G10 section head. **Fits the day** — because it lives inside the ten-minute window that already exists between meetings, not outside it. It does not add a wellbeing ritual to his day. It removes operational friction from acts of real work he was already going to do, and offers restoration in the space that's left.

## Wellbeing outcome

Hamad walks into stand-up steady. Leaves the building at 17:20. Doesn't carry Reem home. Arrives at his daughter's bedtime present. Sleeps without the conversation replaying. Accumulates, over months, the capacity to keep leading eleven people — rather than depleting toward burnout at month 9. **That's رَاحَة.**

## Stack

Claude Design → Claude Code → Anthropic API → Vercel. Live AI in the prototype, not hardcoded scripts. Six Anthropic API calls per session: three streamed plain-text (the read, the delay note, the close-the-loop to Reem) and three structured JSON (the swipe prompts, the restoration proposal, the 17:10 close).

## Submission

Interactive prototype (live URL, mobile-tested) + process deck (built in Claude Design, exported PPTX) + 3-minute demo walkthrough.
