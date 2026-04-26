// ---------------------------------------------------------------------------
// questions.ts — the three swipe prompts (P1–P3), each mapping to one fixed
// signal dimension. Order is load-bearing: the routing table in §7 of
// raaha-system-prompt-input.md keys on (P1, P2, P3) in this order.
//
// Source of truth: /docs/raaha-system-prompt-input.md §6 (canonical output).
//
// Note: the earlier P2 "scenery" dimension was cut — it overlapped too much
// with P3 reshape. Three prompts now, each earning its keep.
//
// Hardcoded for this build. A future live Call 4 drops in by replacing this
// array at runtime — dimension IDs and option values stay the same so the
// routing table keeps working.
// ---------------------------------------------------------------------------

export type SwipeDirection = "left" | "right" | "up";

/**
 * The three fixed signal dimensions the routing table reads from.
 * Order matters — it's the key the routing lookup in §7 expects.
 *   weight  — does not route; shapes Call 5's opening tone
 *   hunger  — gates Coffee Shop vs Quiet Break
 *   reshape — splits within each hunger branch
 */
export type Dimension = "weight" | "hunger" | "reshape";

export interface SwipeQuestion {
  id: Dimension;
  prompt: string;
  /** The value a left swipe records (maps to option_a in the API schema). */
  leftLabel: string;
  /** The value a right swipe records (maps to option_b in the API schema). */
  rightLabel: string;
}

export interface SwipeResponse {
  questionId: Dimension;
  direction: SwipeDirection;
  /** ISO 8601. Captured at commit time, not drag-start. */
  timestamp: string;
}

export const QUESTIONS: SwipeQuestion[] = [
  {
    // P1 — Emotional weight. Acknowledgement only; does not route. Shapes
    // Call 5's opening tone ("That one stuck." vs "Good read on the day.").
    id: "weight",
    prompt: "Your last meeting ran longer than expected. How did it land?",
    leftLabel: "still heavy",
    rightLabel: "landed okay",
  },
  {
    // P2 — Hunger. Gates Coffee Shop. FIXED labels per spec — don't change.
    id: "hunger",
    prompt: "Have you eaten anything today?",
    leftLabel: "I'm fine",
    rightLabel: "I could eat",
  },
  {
    // P3 — Openness to reshape the next 1:1. Splits change-meeting vs
    // lighter intervention within each P2 branch.
    id: "reshape",
    prompt: "Your next 1:1 is at 14:30. Want to try something different?",
    leftLabel: "keep as-is",
    rightLabel: "yes",
  },
];
