# Raaha — Information Architecture & Key Flows
**Day 2 artifact | v2 — rewritten around the loop primitive**
Candidate: Bevin Mohabeer | GovAI / DGE AI Factory | Submission: Mon 27 April 2026

---

## What changed from v1

1. **Architectural spine unified.** Layer 1 (Orchestration) and Layer 2 (Restoration) collapse into a single primitive: the loop. Operational loops and wellbeing loops share one mechanism. Layer 3 (Memory) becomes "loops that persist across time until they close."
2. **Screen 1 gains two quantified surfaces.** The رَاحَة reading (diagnostic of the day) and the 14-day loops-closed pattern (history of Raaha's work).
3. **Dismissal behavior locked.** A wellbeing loop dismissed on Screen 4 fades silently. Tracked as a back-stage metric for Raaha's learning; never surfaced to the user.

---

## Scope lock

5 screens maximum. Each is a complete, self-sufficient experience on QR entry. Navigation shell connects all screens so the full arc is accessible from any entry point.

**QR destinations in the deck:**
1. Central QR → Screen 1 (Home / Today)
2. Orchestration QR → Screen 2 (Read + Artefacts)
3. Check-in QR → Screen 3 (Swipe)
4. Restoration QR → Screen 4 (Proposal)
5. Close QR → Screen 5 (17:10)

---

## The architectural spine: the loop

Raaha operates on one primitive. **A loop is any operational or emotional thread Raaha helps resolve.** Every action Raaha takes is in service of opening, proposing, closing, or remembering a loop.

### The phases of a loop

- **Open** — Raaha identifies a thread that needs resolution. Trigger can be pressure signals in the day (calendar, comms, timing) or an explicit check-in swipe.
- **Propose** — Raaha offers a specific close. A move, a message, a walk, a permission.
- **Act** — The user confirms. Artefacts are produced; the action is taken in the world.
- **Close** — The loop resolves. Usually immediate for operational loops. Deferred for loops with external dependencies (a reply, an embodied act, the end of the day).

### Two kinds of loops, one mechanism

| Operational loop | Wellbeing loop |
|---|---|
| Clears weight from the day | Produces rest |
| Opened by Raaha's reading of pressure signals | Opened by the check-in swipe |
| Closes on artefact action (send, move, confirm) | Closes on Accept (with action) or Dismiss (silent fade) |
| Example: Reem close-the-loop message | Example: 1:1 moved to coffee shop |

**Sequencing is a design principle, not an architectural rule.** Operational loops run first in Hamad's 14:20 flow because an employee carrying unresolved weight can't actually receive restoration. But the mechanism is identical.

### Memory is loops persisted across time

A loop opened at 14:20 can close at 14:24 (immediate), 16:20 (external dependency — Reem replies), or 17:10 (end-of-day permission). This is what makes Raaha a co-pilot, not a chatbot. Persistence is the demonstration.

### Back-stage learning on dismissal

A wellbeing loop opened via check-in and then dismissed on Screen 4 fades silently. Logged internally so Raaha refines future proposals (the swipe pattern that preceded a dismissal is signal). **Never surfaced to the user.** No dismissal count, no visible absence, no "you didn't respond to X." Preserves the stigma constraint and keeps the loops-closed pattern purely additive.

---

## Screen map

| Screen | What happens | Loops active |
|---|---|---|
| 1 — Home / Today | World model + رَاحَة reading + 14-day loops pattern + timeline with anchors | Displays closed loops across 14 days; surfaces approaching moments |
| 2 — Read + Artefacts | Raaha reads the day, opens operational loops, closes them via artefacts | Three operational loops open and close in one continuous beat |
| 3 — Check-in | Swipe opens one wellbeing loop; responses shape the proposal | One wellbeing loop opens |
| 4 — Restoration | Raaha proposes the close; user Accepts or Dismisses | Wellbeing loop closes (Accept = with action; Dismiss = silent fade) |
| 5 — Close | Deferred closes land; day's final loop closes | Reem conversation loop (external), end-of-day loop (implicit) |

---

## Screen 1 — Home / Today
**Raaha's world model + quantified state**

### Purpose on entry
Expose the raw material Raaha is working from. Within three seconds, a judge should understand: the AI has real context (calendar, comms, timing), a live reading of the current day (رَاحَة), and a real history (loops closed over the last two weeks).

### Elements on the screen

1. **Date and time context.** Tuesday, 14:18.
2. **رَاحَة reading.** Live 0–100 score reading how much rest the day's current shape permits. Tappable for components: cadence (back-to-backs vs breaks), open loops, time-since signals (last meal, last break), register load (difficult conversations), recovery acts taken. No red/green — warm-tight to cool-clear gradient. Diagnostic of the day, not of the user.
3. **14-day loops-closed pattern.** Horizontal 14-day strip. Each day shows closed loops typed by icon (operational vs wellbeing). Today's cell highlights. Shows cadence of Raaha's useful work, not cadence of user engagement. No empty-square pressure.
4. **Today's timeline.** Shape of Hamad's day — meetings, stand-up, Reem 1:1, moment anchors at 14:20 and 17:10.
5. **Moment anchors.** Tappable pins on the timeline — entry points to Screens 2 and 5 on cold QR demo.

### What the user does
Orients. Optionally taps a moment anchor or the رَاحَة reading for components.

### What the AI does
Passively renders its read of the day. Generates new content only when a moment is live. **The display itself is the AI demonstration** — the data Raaha can see is what no existing Abu Dhabi wellbeing tool can see.

### State transitions
- **A — Default.** Today's shape, no active moment.
- **B — Ambient alert.** A moment is approaching or active (surfaced on timeline).
- **C — رَاحَة shifts.** Reading changes live when loops close. Most visible transition: reading climbs after the 14:20 flow confirms.

### Implied but not shown
Onboarding, authentication, morning data ingestion, cumulative historical context beyond 14 days.

---

## Screen 2 — 14:20, Read + Artefacts
**Operational loops open and close**

### Moment served
14:20. Post-Reem 1:1 that didn't land. Stand-up in ten minutes. High stress point.

### Purpose on entry
The hero capability demo for operational loops. AI synthesis → AI orchestration → three loops closed in under four minutes, as one continuous beat.

### Loops on this screen
- **Stand-up loop.** Opens on Raaha's read (meeting conflict + post-1:1 stress signal). Closes on confirmation (meeting moved).
- **Delay-note loop.** Opens on read (team will expect stand-up at 14:30). Closes on send (Arabic salaam, warm, brief).
- **Reem message loop.** Opens on read (1:1 ended without resolution). Closes on send. *Note: the message loop closes at 14:24; the conversation loop — did Reem receive it well — remains open until 16:20 when she replies, surfaced on Screen 5.*

### What the user sees
- **State A:** Raaha's read — four-line synthesis only Raaha could produce — plus the proposal.
- **State B:** On tap-yes, live artefact generation. Calendar updates. Two messages stream in, register-tuned per audience.
- **State C:** Confirmed. "Six minutes back. Three loops closed." رَاحَة reading visibly shifts. Handoff cue to check-in.

### What the user does
Taps yes. Watches artefacts generate. Optionally edits one word in the Reem draft. Confirms sends.

### What the AI does
- State A: live Anthropic streaming call for the read
- State B: two simultaneous streaming calls producing the two messages
- Writes the calendar move as a real artefact — state change persists on Screen 1 if revisited

### State transitions
- **A — Read.**
- **B — Generating.** Artefacts stream in.
- **C — Confirmed.** Loops close. رَاحَة shifts. Handoff.

### Implied but not shown
The 1:1 itself; Reem's actual pushback; the team's receipt of the delay note (implied to land, not demoed).

---

## Screen 3 — 14:24, The Check-in
**Wellbeing loop opens**

### Moment served
Space has been created by operational loops closing. Raaha asks what to do with it.

### Purpose on entry
**The act of doing the check-in opens a wellbeing loop.** Swipes don't answer separate questions — they calibrate the shape of the loop Raaha will propose to close on Screen 4. This is the hero AI affordance: prompts generated live from the day's context, not a fixed questionnaire.

### Loop on this screen
- **Wellbeing loop opens.** Singular — one loop per check-in cycle. The swipe pattern shapes the proposal.

### What the user sees
- Three swipe prompts in sequence, each two-second input. The three dimensions are fixed — P1 emotional weight, P2 hunger, P3 openness to reshape the 3pm — but the exact wording is generated from the day's context.
- Canonical prompts: *"Your 1:1 with Reem ran long. How did it land?"* / *"Have you eaten anything today?"* / *"Your next 1:1 is at 15:00. Want to try something different?"*
- Binary swipe, no typing, no clinical labels (no "mood," no "feeling")

### What the user does
Swipes through three prompts.

### What the AI does
- Live generates each prompt based on day context — regenerates on fresh session entry. Dimension order is load-bearing; the routing table in §7 of the system-prompt-input expects (P1, P2, P3) in that order.
- The 8 possible swipe combinations route deterministically to one of five outcomes on Screen 4. Claude does not pick the outcome; the app does, before Call 5 fires.
- Does not label, diagnose, or pathologise

### State transitions
- **A–C** — one prompt per state
- **D** — handoff cue to Screen 4

### Implied but not shown
Raaha's internal reasoning between the last swipe and the proposal. Back-stage tracking of the pattern.

---

## Screen 4 — 14:26, The Restoration
**Wellbeing loop closes**

### Moment served
Raaha's response to the check-in.

### Purpose on entry
Demonstrates the "chosen, not imposed" principle. Closes the wellbeing loop. Accept reshapes something in Hamad's afternoon; Dismiss closes silently. **The product's thesis in one screen: restoration for a civil servant is a differently-shaped meeting, a protected ten minutes, or — when the user closes doors — silence.**

### Loop on this screen
- **Wellbeing loop closes.**
  - **Accept** → loop closes visibly, operational artefacts fire (or the protected block is booked), post-acceptance affirmation shows, contributes to today's count on the Screen 1 pattern, رَاحَة reading shifts.
  - **Dismiss** → loop closes silently, fades, back-stage log only. Pattern unaffected.
  - **Stand Down** (no Accept/Dismiss) → Raaha acknowledges and stays out. No navigation to Screen 5.

### The five outcomes

The three swipes on Screen 3 route deterministically to exactly one of five outcomes. The outcome is selected by the app before Call 5 fires (see §7 of the system-prompt-input doc for the routing table).

| Outcome | Action | DM? |
|---|---|---|
| **Coffee Shop (change meeting)** | Move the 15:00 1:1 to the Coffee Shop, 4th Floor | Yes |
| **Coffee Shop (snack)** | 10-minute block 14:35–14:45 at the Coffee Shop. 3pm stays. | No |
| **Lounge (change meeting)** | Move the 15:00 1:1 to the Quiet Lounge, 4th Floor | Yes |
| **Quiet Break** | 10-minute protected block 14:35–14:45 with inline location pick (Outside / Quiet Lounge). 3pm stays. | No |
| **Stand Down** | No action. Raaha acknowledges and stays out of the way. | No |

### What the user sees
- Raaha's proposal, warm and direct. Voice is shaped by P1 weight (opener varies between heavy and okay registers) and outcome. Canonical example (Coffee Shop change, P1 heavy):
  > *"That one's sitting with you. Change your scenery — shall we take your 1:1 over coffee?"*
- For **Quiet Break** specifically: two inline tap targets side-by-side (Outside / Quiet Lounge) plus the current Abu Dhabi temperature so the user picks with real data. One tap accepts and picks in a single gesture.
- For **Stand Down**: just the acknowledgement message. No Accept, no Dismiss, no ambient signal, no follow-up. The message is the product.
- For all other outcomes: Accept primary action (wording varies — *Send message to attendee* / *Book the ten minutes*) plus Dismiss secondary.
- After Accept (and after a Quiet Break location pick): a short empowering affirmation — *"Enjoy — take care of yourself."*

### What the user does
One tap to accept, one tap to dismiss. Quiet Break folds accept + location choice into a single tap. Stand Down offers only a quiet exit.

### What the AI does
- Produces one proposal, not a menu. Quiet Break naming both walk and Quiet Lounge in one sentence is NOT a menu — it's a single restoration with two location modes.
- On Accept (non-Stand Down):
  - For change_location outcomes: updates the 15:00 calendar entry and drafts a short DM to the attendee for the user to send.
  - For protected-block outcomes: books the 14:35–14:45 block at the chosen location.
  - Returns the post-acceptance empowering line alongside the proposal, shown after the accept tap.
- On Dismiss: back-stage logs the swipe-pattern → dismissal pairing. No user-facing trace.
- On Stand Down: no action fires. Back-stage logs the acknowledgement for calibration.

### State transitions
- **A — Proposal.** Raaha's message visible. For Quiet Break, the inline picker + temperature. For Stand Down, the message plus a quiet Done.
- **B — Accept / Pick.** Calendar updates (or block books). Change_location outcomes show a DM draft step before sending. Post-acceptance affirmation lands.
- **C — Dismiss.** Silent fade to home. Back-stage only.

### Implied but not shown
The routing logic itself; the attendees receiving the DM; the 1:1 actually happening at the new location; the protected block being honoured.

---

## Screen 5 — 17:10, The Close
**Deferred closes land**

### Moment served
End of day. Laptop half-closed. About to decide whether to open the inbox once more.

### Gating
Screen 5 only renders if Screen 4 ended in an accepted restoration (Coffee Shop change, Coffee Shop snack, Lounge change, or Quiet Break). A Stand Down outcome or a dismissed proposal closes the session without Screen 5 — Raaha does not surface a close for a loop that didn't close. QR direct-entry seeds Coffee Shop (change) acceptance so judges can demo the close beat cold.

### Purpose on entry
Proves loops persist across time. The Reem conversation loop (message sent at 14:24, reply awaited) closes externally at 16:20 — Raaha surfaces that close at 17:10. The restoration loop (closed at 14:26, outcome-specific) gets a quality check. And the implicit end-of-day loop closes with an affirming register.

### Loops on this screen
- **Reem conversation loop.** External close. Reply landed at 16:20. Raaha reports.
- **Restoration follow-up.** Not a new loop — a soft check on whether the earlier restoration landed well. Copy varies by outcome (over coffee / ten minutes and something small / in the Quiet Lounge / stepped outside / ten minutes in the Quiet Lounge).
- **End-of-day loop.** Opens implicitly from day rhythm. Closes with an affirming register.

### What the user sees
Three beats, revealed in sequence:
1. **Receipt** — Reem's reply summary (not full text)
2. **Acknowledgement** — soft check referencing the actual restoration taken (e.g. *"You took your 1:1 over coffee this afternoon. Did it help?"*). Single swipe.
3. **Close** — affirming, not permission-framed. 2–6 words. Canonical: *"Good work today."* / *"Productive one."* / *"That one landed."* Forbidden: *"You can leave."*, *"Time to sign off!"*, any paternalistic variant.

### What the user does
Acknowledges receipt. Swipes on the restoration follow-up. Taps to close the day.

### What the AI does
- Carries context from morning — this is the technical demonstration that matters most
- Summarises Reem's reply (privacy posture: summary, never full text)
- Lands the close in an affirming register, not a permission-framed one

### State transitions
- **A — Receipt.**
- **B — Swipe.**
- **C — Close.** Affirming. رَاحَة reading resolves high if loops closed well.

### Implied but not shown
The afternoon's meetings; Reem's actual reply text; tomorrow (Raaha's memory boundary is end-of-day, with saved-item exceptions).

---

## Navigation shell

- **Persistent home affordance** — return to Screen 1 from anywhere
- **Forward progression** within the hero arc (2 → 3 → 4 naturally continuous)
- **Moment anchors** on Screen 1 for lateral jumps
- **Deep-link compatibility** — each screen a discrete URL route, QR-scannable

**QR entry states:**
- Screens 1, 5: "current" state (today view, receipt view)
- Screens 2, 3, 4: "live" state — AI calls regenerate on fresh entry. Judges see AI working, not a replay.

---

## What this IA does NOT include (explicit cuts)

| Cut | Rationale |
|---|---|
| Onboarding / first-run | Judge enters mid-life. Demonstrated behavior beats explained behavior. |
| Settings / privacy controls | Privacy posture demonstrated through AI behavior, not a settings surface. |
| History / journal | Raaha does not produce a scrollable log. Memory demonstrated in 17:10 close and 14-day loops pattern. |
| Notifications center | The 14:20 surfacing happens inline on Home, not as a separate inbox. |
| Multi-persona picker | Hamad-only in prototype. Mariam and HR Law surfacer live in the deck as platform argument. |
| Arabic as screen structure | Arabic is a UI-level switcher, timeboxed, killable Saturday 4pm. |
| Streaks / targets / dismissal counts | Gamification would pathologise or pressure. The loops-closed pattern is additive only. |
| Open-loops list | User never sees "things you haven't done." Only what's closed. |

---

## System-level implications (for AI behavior principles doc)

- **Read access:** calendar, comms, location, timing signals, pre-saved personal items
- **Write access:** calendar (move meetings, block time), drafts only for messages
- **Never-auto:** no message sends, no meeting invites to new parties, no upward communication
- **Span of action:** only within Hamad's scope — never drafts upward to his director
- **Content handling:** summaries of private exchanges, never full text
- **Memory boundary:** end-of-working-day by default; exceptions are explicitly-saved items (photos, audio, notes)
- **Silence as a feature:** no surfacing during meetings, prayer windows, outside working hours
- **Back-stage learning:** dismissed wellbeing loops logged internally; never surfaced
- **Loop transparency principle:** user sees closed loops, never open loops as "things you haven't done"
- **رَاحَة reading is diagnostic of the day, not of the user** — surfaces day-shape, not performance. Explicit design commitment.

---

## Open questions to resolve before Screen 2 design starts

1. **Home timeline format.** Time scrubber (day as horizontal timeline) vs moment-card grid vs agenda-list. Default: scrubber with moment pins.
2. **QR entry state for moments.** Live for 2–4, receipt for 5. Confirm.
3. **Check-in swipe cardinality.** Binary vs three-way. Default: binary.
4. **Live AI regeneration on repeat QR entry.** Regenerate fresh per session, cache within session. Default.
5. **Concept brief + story arc reconciliation.** Both use Layer 1/2/3 vocabulary. Under the loop primitive they need light revision. Flag as Day 2/3 followup — not a blocker for AI behavior principles. Recommend a 20-minute pass on each before Day 3 build starts so the deck narrative matches the prototype architecture.
6. **رَاحَة reading component weighting.** Each component needs a weight for the simulation. For prototype, hand-tuned values are fine. For a real product this is a real calibration problem. Flag, don't block.
7. **Screen 4 dilution on cold QR entry.** If a judge QR-scans Screen 4 directly without having swiped, the proposal reads thinner than in flow. Proposed fix: a light breadcrumb on cold entry showing the swipe-pattern that would have produced this offering ("Based on: long 1:1, desk-bound morning, light hunger, needs a moment"). Flag for your call before Day 3.
