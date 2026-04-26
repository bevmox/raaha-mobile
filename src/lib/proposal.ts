// ---------------------------------------------------------------------------
// proposal.ts — derives a restoration proposal for a given outcome + weight.
//
// Returns the canonical message strings from §7 of raaha-system-prompt-input.md.
// Tomorrow this is replaced with the live Call 5 payload; the return shape
// mirrors the canonical JSON so the swap is file-local.
//
// P1 (weight) shapes the opening tone only:
//   heavy: "That one's sitting with you." / "That one stuck." / "That one's with you."
//   okay:  "Good read on the day." / "Ten minutes is yours." / "Got it."
//
// post_accept_message is the empowering affirmation shown after the user
// accepts a proposal (or picks a Quiet Break location). Null on Stand Down.
// ---------------------------------------------------------------------------

import { routeOutcome, type Outcome, type WeightSignal } from "./routing";
import type { SwipeResponse } from "./questions";

export type { Outcome, WeightSignal } from "./routing";

// ---------------------------------------------------------------------------
// Discriminated union — the UI switches on `outcome` to pick which flow to
// render. Each variant carries exactly the params that outcome needs.
// ---------------------------------------------------------------------------

const POST_ACCEPT_MESSAGE = "Enjoy — take care of yourself.";

export interface CoffeeShopChangeProposal {
  outcome: "coffee_shop_change";
  weight: WeightSignal;
  message: string;
  postAcceptMessage: string;
  action: {
    type: "change_location";
    params: {
      meetingId: string;
      meetingTime: string;
      newLocation: string;
      notifyAttendees: true;
      notificationDraft: string;
    };
  };
}

export interface LoungeChangeProposal {
  outcome: "lounge_change";
  weight: WeightSignal;
  message: string;
  postAcceptMessage: string;
  action: {
    // Same action shape as Coffee Shop (change) — different location.
    type: "change_location";
    params: {
      meetingId: string;
      meetingTime: string;
      newLocation: string;
      notifyAttendees: true;
      notificationDraft: string;
    };
  };
}

export interface CoffeeShopSnackProposal {
  outcome: "coffee_shop_snack";
  weight: WeightSignal;
  message: string;
  postAcceptMessage: string;
  action: {
    type: "protected_block_coffee_snack";
    params: {
      start: string;
      end: string;
      location: string;
      title: string;
      blockCalendar: true;
    };
  };
}

export type QuietBreakLocation = "Outside (walk)" | "Quiet Lounge, 4th Floor";

export interface QuietBreakProposal {
  outcome: "quiet_break";
  weight: WeightSignal;
  message: string;
  postAcceptMessage: string;
  action: {
    type: "protected_block_quiet_break";
    params: {
      start: string;
      end: string;
      locationOptions: QuietBreakLocation[];
      /** Null at proposal time — set by the UI when the user taps. */
      locationPicked: QuietBreakLocation | null;
      blockCalendar: true;
      /** Used by the UI alongside the walk option so the user decides with real data. */
      abuDhabiTempC: number;
    };
  };
}

export interface StandDownProposal {
  outcome: "stand_down";
  weight: WeightSignal;
  message: string;
  postAcceptMessage: null;
  action: null;
}

export type RestorationProposal =
  | CoffeeShopChangeProposal
  | CoffeeShopSnackProposal
  | LoungeChangeProposal
  | QuietBreakProposal
  | StandDownProposal;

// ---------------------------------------------------------------------------
// Main entry point. Null only on routing failure.
// ---------------------------------------------------------------------------

export function deriveProposal(
  responses: SwipeResponse[],
): RestorationProposal | null {
  const routed = routeOutcome(responses);
  if (routed === null) return null;
  return buildProposal(routed.outcome, routed.weight);
}

function buildProposal(
  outcome: Outcome,
  weight: WeightSignal,
): RestorationProposal {
  switch (outcome) {
    case "coffee_shop_change":
      return {
        outcome: "coffee_shop_change",
        weight,
        message:
          weight === "heavy"
            ? "That one's sitting with you. Change your scenery — shall we take your 1:1 over coffee?"
            : "Good read on the day. Shall we take your 1:1 over coffee?",
        postAcceptMessage: POST_ACCEPT_MESSAGE,
        action: {
          type: "change_location",
          params: {
            meetingId: "1on1_1430",
            meetingTime: "14:30",
            newLocation: "Coffee Shop, 4th Floor",
            notifyAttendees: true,
            notificationDraft: "Let's meet over coffee — change of pace.",
          },
        },
      };

    case "lounge_change":
      // Currently only fires from row 7 (landed okay + I'm fine + yes). The
      // heavy variant is defensive in case the routing table is extended.
      return {
        outcome: "lounge_change",
        weight,
        message:
          weight === "heavy"
            ? "That one's with you. Shall we take your 1:1 in the Quiet Lounge instead?"
            : "Good read on the day. Shall we take your 1:1 in the Quiet Lounge?",
        postAcceptMessage: POST_ACCEPT_MESSAGE,
        action: {
          type: "change_location",
          params: {
            meetingId: "1on1_1430",
            meetingTime: "14:30",
            newLocation: "Quiet Lounge, 4th Floor",
            notifyAttendees: true,
            notificationDraft:
              "Let's take the 1:1 in the Quiet Lounge — change of pace.",
          },
        },
      };

    case "coffee_shop_snack":
      return {
        outcome: "coffee_shop_snack",
        weight,
        message:
          weight === "heavy"
            ? "That one stuck. Ten minutes, something small — the Coffee Shop is quiet right now."
            : "Ten minutes is yours. Something small at the Coffee Shop?",
        postAcceptMessage: POST_ACCEPT_MESSAGE,
        action: {
          type: "protected_block_coffee_snack",
          params: {
            // 10-min block sized to fit cleanly before the 14:30 1:1
            // (current time is ~14:07; this leaves a 5-min runway after
            // the block to walk back). Was 14:35–14:45 when the next
            // meeting was 15:00 — shifted earlier with the meeting.
            start: "14:15",
            end: "14:25",
            location: "Coffee Shop, 4th Floor",
            title: "Ten minutes at the Coffee Shop",
            blockCalendar: true,
          },
        },
      };

    case "quiet_break":
      return {
        outcome: "quiet_break",
        weight,
        message:
          weight === "heavy"
            ? "That one's with you. Ten minutes is yours — step outside and walk a bit before your 14:30, or if it's too hot the Quiet Lounge is free. Your own space will do what the desk can't."
            : "Ten minutes is yours. Step outside and walk a bit before your 14:30 — or if it's too hot, the Quiet Lounge is free. Your own space will do what the desk can't.",
        postAcceptMessage: POST_ACCEPT_MESSAGE,
        action: {
          type: "protected_block_quiet_break",
          params: {
            // 10-min block before the 14:30 1:1 (matches coffee-snack window).
            start: "14:15",
            end: "14:25",
            locationOptions: ["Outside (walk)", "Quiet Lounge, 4th Floor"],
            locationPicked: null,
            blockCalendar: true,
            // Canonical ambient signal from §7 input context.
            abuDhabiTempC: 42,
          },
        },
      };

    case "stand_down":
      // The demo's single strongest restraint moment when weight is heavy.
      // The message is the product: "I'll stay quiet — I'm here if you need me."
      // No action, no navigation, no post-accept flow.
      return {
        outcome: "stand_down",
        weight,
        message:
          weight === "heavy"
            ? "That one's still with you. I'll stay quiet until your 14:30 — I'm here if you need me."
            : "Got it. I'll stay quiet until your 14:30.",
        postAcceptMessage: null,
        action: null,
      };
  }
}
