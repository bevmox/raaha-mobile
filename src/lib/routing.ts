// ---------------------------------------------------------------------------
// routing.ts — the 8-row deterministic outcome table.
//
// Latest revision introduces a fifth outcome, Lounge (change), and breaks
// the earlier "P1 does not route" principle: rows 7 and 8 now differ from
// rows 3 and 4 on the P1 weight axis.
//
//   Row 3: still heavy | I'm fine | yes         → Lounge (change)
//   Row 4: still heavy | I'm fine | keep as-is  → Stand Down
//   Row 7: landed okay | I'm fine | yes         → Lounge (change)
//   Row 8: landed okay | I'm fine | keep as-is  → Quiet Break
//
// Rows 3 and 7 now pair (both Lounge change). P1 still splits rows 4 vs 8:
// a user carrying weight who closes doors gets Stand Down; a user who's
// okay but not hungry or reshape-ready gets a Quiet Break anyway. This is
// the only P1 asymmetry left in the table.
//
// All Coffee Shop rows (1/2/5/6) pair across P1 as they did before.
// ---------------------------------------------------------------------------

import type { Dimension, SwipeDirection, SwipeResponse } from "./questions";

export type Outcome =
  | "coffee_shop_change"
  | "coffee_shop_snack"
  | "lounge_change"
  | "quiet_break"
  | "stand_down";

export type WeightSignal = "heavy" | "okay";

// ---------------------------------------------------------------------------
// Full 8-row routing table keyed by (P1 weight, P2 hunger, P3 reshape).
//
// Slot encoding:
//   P1 weight:   L = "still heavy"    R = "landed okay"
//   P2 hunger:   L = "I'm fine"       R = "I could eat"
//   P3 reshape:  L = "keep as-is"     R = "yes"
// ---------------------------------------------------------------------------
const ROUTING_TABLE: Record<string, Outcome> = {
  // P1 = still heavy
  LRR: "coffee_shop_change", // row 1
  LRL: "coffee_shop_snack", //   row 2
  LLR: "lounge_change", //        row 3
  LLL: "stand_down", //           row 4

  // P1 = landed okay
  RRR: "coffee_shop_change", // row 5
  RRL: "coffee_shop_snack", //   row 6
  RLR: "lounge_change", //       row 7 (new)
  RLL: "quiet_break", //         row 8 (new)
};

export interface RoutingResult {
  outcome: Outcome;
  /** P1 weight signal — used by the proposal to shape the opening tone. */
  weight: WeightSignal;
}

/**
 * Resolve the swipe responses to an outcome plus the P1 weight signal.
 * Returns null only on a routing failure (missing dimension). A skip
 * (up-swipe) on any routing dimension falls through to Stand Down with
 * weight inferred from P1 if available, else "okay".
 */
export function routeOutcome(responses: SwipeResponse[]): RoutingResult | null {
  const byDim = new Map(responses.map((r) => [r.questionId, r.direction]));

  const required: Dimension[] = ["weight", "hunger", "reshape"];
  for (const dim of required) {
    if (!byDim.has(dim)) return null;
  }

  const weight = readWeight(byDim.get("weight")!);

  // Any skip across the routing dimensions ends in Stand Down — the user
  // didn't commit on a signal, and Raaha respects that.
  if (
    byDim.get("weight") === "up" ||
    byDim.get("hunger") === "up" ||
    byDim.get("reshape") === "up"
  ) {
    return { outcome: "stand_down", weight };
  }

  const key =
    directionToSlot(byDim.get("weight")!) +
    directionToSlot(byDim.get("hunger")!) +
    directionToSlot(byDim.get("reshape")!);
  const outcome = ROUTING_TABLE[key] ?? "stand_down";
  return { outcome, weight };
}

function directionToSlot(dir: SwipeDirection): "L" | "R" {
  return dir === "left" ? "L" : "R";
}

function readWeight(dir: SwipeDirection): WeightSignal {
  // Skip on P1 defaults to "okay" — Raaha doesn't presume heaviness.
  if (dir === "left") return "heavy";
  return "okay";
}
