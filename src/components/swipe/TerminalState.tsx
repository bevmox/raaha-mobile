"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import * as P from "@/lib/physics";
import {
  deriveProposal,
  type CoffeeShopChangeProposal,
  type CoffeeShopSnackProposal,
  type LoungeChangeProposal,
  type QuietBreakLocation,
  type QuietBreakProposal,
  type RestorationProposal,
} from "@/lib/proposal";

// The two outcomes that share the change-location flow (message → draft → send).
type ChangeLocationProposal =
  | CoffeeShopChangeProposal
  | LoungeChangeProposal;
import type { SwipeResponse } from "@/lib/questions";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Terminal UI state machine. The exact flow depends on outcome:
//   coffee_shop_change: thinking → propose → (send DM or dismiss) → sent/done → accepted
//   coffee_shop_snack:  thinking → propose → accepted
//   quiet_break:        thinking → propose (inline picker) → accepted (with picked location)
//   stand_down:         thinking → acknowledge
//   null (routing fail): thinking → none
export type TerminalView = "thinking" | "propose" | "draft" | "accepted" | "none";

interface TerminalStateProps {
  responses: SwipeResponse[];
  /**
   * Optional starting view. Production starts at "thinking" and times out
   * to the next state via TERMINAL_PROPOSAL_DELAY_MS. The capture flow
   * (?scenario=) seeds this directly so screenshots land on the target
   * view without animation.
   */
  initialView?: TerminalView;
  /**
   * Notifies SwipeStack of the current sub-view so it can hide page-chrome
   * (e.g. the bottom Dismiss button) during the "thinking" beat — the
   * Figma's 14:102 layout has nothing under the Thinking… text.
   */
  onViewChange?: (view: TerminalView) => void;
  /**
   * Fires once per session when the user reaches the accepted view, with
   * the derived proposal and any quiet-break location pick. SwipeStack
   * uses this to record the outcome in the home-screen Today store so
   * the Up Next list reflects the completed check-in.
   */
  onAccepted?: (
    proposal: RestorationProposal,
    pick: QuietBreakLocation | null,
  ) => void;
}

export function TerminalState({
  responses,
  initialView,
  onViewChange,
  onAccepted,
}: TerminalStateProps) {
  const reducedMotion = useReducedMotion();

  const proposal = useMemo<RestorationProposal | null>(
    () => deriveProposal(responses),
    [responses],
  );

  const [view, setView] = useState<TerminalView>(initialView ?? "thinking");

  // Bubble view changes up so the page chrome (page-level Dismiss) can
  // react. Fires once on mount with the initial view and on every change.
  useEffect(() => {
    onViewChange?.(view);
  }, [view, onViewChange]);

  // Quiet Break: the user's picked location is captured when they tap. Null
  // means they haven't picked yet (and the picker is still visible).
  const [quietBreakPick, setQuietBreakPick] = useState<QuietBreakLocation | null>(
    null,
  );

  // Fire onAccepted exactly once per entry into the accepted view. The
  // ref guards against duplicate dispatches if proposal/pick identity
  // churns while the view stays accepted. Resetting the ref when the
  // view leaves "accepted" lets a back-then-re-complete flow record a
  // fresh outcome (consistent with the spec — "If we do a second check
  // in, we add to the up next").
  //
  // NOTE: this effect MUST sit below the `quietBreakPick` useState
  // declaration — its deps array references that binding synchronously
  // during render, which would TDZ-throw if it ran first.
  const acceptedFiredRef = useRef(false);
  useEffect(() => {
    if (view !== "accepted") {
      acceptedFiredRef.current = false;
      return;
    }
    if (acceptedFiredRef.current || !proposal) return;
    acceptedFiredRef.current = true;
    onAccepted?.(proposal, quietBreakPick);
  }, [view, proposal, quietBreakPick, onAccepted]);

  // Thinking beat → next view. Stand Down skips "propose" entirely —
  // there is no proposal to accept or dismiss; the message IS the product.
  // Skipped when initialView is seeded (capture flow) — the view is already
  // pinned and the auto-advance would just clobber it.
  useEffect(() => {
    if (initialView) return;
    const timer = setTimeout(() => {
      if (!proposal) return setView("none");
      if (proposal.outcome === "stand_down") return setView("accepted");
      setView("propose");
    }, P.TERMINAL_PROPOSAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [proposal, initialView]);

  const fade = reducedMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: "easeOut" as const };

  return (
    <div className="flex w-full flex-col items-stretch justify-center">
      <AnimatePresence mode="wait">
        {view === "thinking" && (
          <FadeBlock key="thinking" transition={fade}>
            <div className="flex flex-col items-center py-8">
              <p className="text-body-lg text-ink-secondary">Thinking&hellip;</p>
            </div>
          </FadeBlock>
        )}

        {view === "propose" && proposal && proposal.outcome !== "stand_down" && (
          <FadeBlock key="propose" transition={fade}>
            <ProposeView
              proposal={proposal}
              onAcceptChange={() => setView("draft")}
              onAcceptSnack={() => setView("accepted")}
              onPickQuietBreak={(loc) => {
                setQuietBreakPick(loc);
                setView("accepted");
              }}
            />
          </FadeBlock>
        )}

        {view === "draft" &&
          proposal &&
          (proposal.outcome === "coffee_shop_change" ||
            proposal.outcome === "lounge_change") && (
            <FadeBlock key="draft" transition={fade}>
              <DraftView
                proposal={proposal}
                onSend={() => setView("accepted")}
              />
            </FadeBlock>
          )}

        {view === "accepted" && proposal && (
          <FadeBlock key="accepted" transition={fade}>
            <AcceptedView
              proposal={proposal}
              quietBreakPick={quietBreakPick}
            />
          </FadeBlock>
        )}

        {view === "none" && (
          <FadeBlock key="none" transition={fade}>
            <div className="flex flex-col items-center gap-6 py-8 text-center">
              <p className="text-body-lg text-ink-primary">
                No change. Come back when you&rsquo;re ready to choose.
              </p>
            </div>
          </FadeBlock>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FadeBlock — motion div wrapper that applies the shared fade transition.
// Extracted because AnimatePresence children need to be motion components
// with matching initial/animate/exit props for the transitions to work.
// ---------------------------------------------------------------------------

function FadeBlock({
  children,
  transition,
}: {
  children: React.ReactNode;
  transition: { duration: number; ease?: "easeOut" };
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ProposeView — Raaha's proposal + the accept/dismiss controls. Button
// layout varies by outcome:
//   coffee_shop_change: [Send message to attendee] (primary) + [Dismiss]
//   coffee_shop_snack:  [Book the ten minutes] (primary) + [Dismiss]
//   quiet_break:        [Outside (walk)] + [Quiet Lounge] side-by-side + [Dismiss]
// ---------------------------------------------------------------------------

type ActiveProposal =
  | CoffeeShopChangeProposal
  | CoffeeShopSnackProposal
  | LoungeChangeProposal
  | QuietBreakProposal;

function ProposeView({
  proposal,
  onAcceptChange,
  onAcceptSnack,
  onPickQuietBreak,
}: {
  proposal: ActiveProposal;
  onAcceptChange: () => void;
  onAcceptSnack: () => void;
  onPickQuietBreak: (loc: QuietBreakLocation) => void;
}) {
  // Note: per the Figma update (15:102), Dismiss lives at the page level
  // (rendered by SwipeStack) — it's the kill button for the swipe page.
  // This view renders only the message and the primary CTA / picker.
  return (
    <div className="flex flex-col gap-8 py-4">
      <p className="text-body-lg text-ink-primary">{proposal.message}</p>

      {(proposal.outcome === "coffee_shop_change" ||
        proposal.outcome === "lounge_change") && (
        <PrimaryButton onClick={onAcceptChange}>
          Send message to attendee
        </PrimaryButton>
      )}

      {proposal.outcome === "coffee_shop_snack" && (
        <PrimaryButton onClick={onAcceptSnack}>
          Book the ten minutes
        </PrimaryButton>
      )}

      {proposal.outcome === "quiet_break" && (
        <QuietBreakPicker
          proposal={proposal}
          onPick={onPickQuietBreak}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// QuietBreakPicker — two tap targets, side-by-side on mobile.
// Temperature shown so the user decides with real data. One tap = accept +
// pick in a single gesture, per spec.
// ---------------------------------------------------------------------------

function QuietBreakPicker({
  proposal,
  onPick,
}: {
  proposal: QuietBreakProposal;
  onPick: (loc: QuietBreakLocation) => void;
}) {
  // Layout per Figma 16:102 — temp moves into the "Go Outside" button (so
  // each option carries its own decision-relevant detail), and a third
  // line on each card carries an ambient signal. The header label
  // "Abu Dhabi: …°C right now" is dropped — its data lives in the card.
  // Dismiss is rendered at the page level by SwipeStack — see ProposeView.
  const [outsideLoc, loungeLoc] = proposal.action.params.locationOptions;
  return (
    <div className="grid grid-cols-2 gap-3">
      <PickerButton onClick={() => onPick(outsideLoc)}>
        <span className="text-body font-medium">Go Outside</span>
        <span className="mt-1 text-caption text-ink-secondary">Abu Dhabi</span>
        <span className="text-caption text-ink-secondary tabular-nums">
          {proposal.action.params.abuDhabiTempC}°C
        </span>
      </PickerButton>
      <PickerButton onClick={() => onPick(loungeLoc)}>
        <span className="text-body font-medium">Quiet Lounge</span>
        <span className="mt-1 text-caption text-ink-secondary">4th Floor</span>
        <span className="text-caption text-ink-secondary">
          Less busy than usual
        </span>
      </PickerButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DraftView (Coffee Shop change only) — the DM artefact block. Tapping Send
// commits the location change AND fires the DM.
// ---------------------------------------------------------------------------

function DraftView({
  proposal,
  onSend,
}: {
  proposal: ChangeLocationProposal;
  onSend: () => void;
}) {
  // Layout per Figma 15:102 — message + ambient (the artefact block) +
  // single primary CTA. The previous inline "Back" is gone; the page's
  // back-arrow already handles back-within-flow, and the page-level
  // Dismiss handles kill.
  //
  // The draft body is editable — the user can revise the message before
  // sending. Local state for now; a future commit can pipe the edited
  // text through onSend and into the action payload.
  const [draft, setDraft] = useState(proposal.action.params.notificationDraft);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow the textarea so wrapped content stays visible without a
  // scrollbar. Resets to "auto" first so the height can shrink on delete.
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [draft]);

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="draft-message"
          className="text-micro font-medium uppercase tracking-wide text-ink-tertiary"
        >
          Draft to your 14:30 attendee
        </label>
        <div className="rounded-md bg-surface-warm p-4">
          <textarea
            id="draft-message"
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={1}
            // resize-none + manual auto-grow so the field reads as a flat
            // text block, not an OS-styled textarea. Inherits font/colour
            // from parent so the editing affordance is the caret alone.
            className="block w-full resize-none bg-transparent font-sans text-body text-ink-primary outline-none placeholder:text-ink-tertiary focus:outline-none"
            aria-label="Draft message to your 14:30 attendee"
          />
        </div>
      </div>

      <PrimaryButton onClick={onSend}>Send</PrimaryButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AcceptedView — the confirmation moment. Shows the receipt of the action
// Raaha took (or, for stand_down, just the acknowledgement), the
// post-accept empowering affirmation, and a Start over button.
// ---------------------------------------------------------------------------

function AcceptedView({
  proposal,
  quietBreakPick,
}: {
  proposal: RestorationProposal;
  quietBreakPick: QuietBreakLocation | null;
}) {
  // Layout per Figma 15:102 — receipt + post-accept message; no inline
  // button. The page-level Dismiss is the single way out (replaces the
  // previous "Start over" inline button per the coffee-snack spec, and
  // applies the same rule across every accepted variant).
  if (proposal.outcome === "stand_down") {
    // The restraint moment. No receipt, no post-accept, minimal presence.
    // The message is the product — page Dismiss is the way out.
    return (
      <div className="flex flex-col gap-8 py-4">
        <p className="text-body-lg text-ink-primary">{proposal.message}</p>
      </div>
    );
  }

  const receipt = acceptedReceipt(proposal, quietBreakPick);

  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="flex flex-col gap-2 border-t border-line-hairline pt-6">
        <p className="text-micro font-medium uppercase tracking-wide text-ink-tertiary">
          {receipt.label}
        </p>
        <p className="text-body-lg text-ink-primary">{receipt.headline}</p>
        {receipt.detail && (
          <p className="text-caption text-ink-secondary">{receipt.detail}</p>
        )}
      </div>

      <p className="text-body-lg text-accent-primary">
        {proposal.postAcceptMessage}
      </p>
    </div>
  );
}

function acceptedReceipt(
  proposal: ActiveProposal,
  quietBreakPick: QuietBreakLocation | null,
): { label: string; headline: string; detail: string | null } {
  switch (proposal.outcome) {
    case "coffee_shop_change":
    case "lounge_change":
      return {
        label: "Meeting location updated",
        headline: `${proposal.action.params.meetingTime} — ${proposal.action.params.newLocation}`,
        detail: "Message sent to your 14:30 attendee.",
      };
    case "coffee_shop_snack":
      return {
        label: "Protected block created",
        headline: `${proposal.action.params.start}–${proposal.action.params.end} — ${proposal.action.params.location}`,
        detail: proposal.action.params.title,
      };
    case "quiet_break": {
      // quietBreakPick should never be null once the user reaches Accepted
      // via the picker, but fall back defensively to the default (walk).
      const picked = quietBreakPick ?? proposal.action.params.locationOptions[0];
      return {
        label: "Protected block created",
        headline: `${proposal.action.params.start}–${proposal.action.params.end} — ${picked}`,
        detail: null,
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Buttons — rectangular, radius.md, no gradient, no shadow. Per design-system
// §Component posture: accent.primary filled for primary; ink.primary outlined
// on canvas for secondary.
// ---------------------------------------------------------------------------

function PrimaryButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-md bg-accent-primary px-4 py-3 text-body font-medium text-surface transition-opacity hover:opacity-90 active:opacity-80"
    >
      {children}
    </button>
  );
}

// PickerButton — a card-style tap target for the Quiet Break location
// picker. Outlined, multi-line, equal visual weight on both options.
function PickerButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[80px] flex-col items-start justify-center rounded-md border border-ink-primary bg-transparent px-4 py-3 text-left transition-colors hover:bg-accent-primary-soft"
    >
      {children}
    </button>
  );
}
