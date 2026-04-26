"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import * as P from "@/lib/physics";
import { deriveProposal } from "@/lib/proposal";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  QUESTIONS,
  type Dimension,
  type SwipeDirection,
  type SwipeResponse,
} from "@/lib/questions";
import { useTodayStore } from "@/lib/today-store";

import { ProgressBar } from "./ProgressBar";
import { SwipeCard } from "./SwipeCard";
import { TerminalState, type TerminalView } from "./TerminalState";

/**
 * Dev/capture-only scenario seeds. URL flag ?scenario=<id> jumps the stack
 * to a specific state without requiring the user to swipe through. Used by
 * the Figma capture flow (one URL per scenario) and by manual QA. Live data
 * paths ignore the flag — when ?scenario isn't set, normal flow runs.
 *
 * Direction → option mapping (per questions.ts comments):
 *   weight:  L=still heavy, R=landed okay
 *   hunger:  L=I'm fine,    R=I could eat
 *   reshape: L=keep as-is,  R=yes
 *
 * Routing keys (per routing.ts):
 *   LRR → coffee_shop_change (heavy)
 *   LRL → coffee_shop_snack  (heavy)
 *   LLR → lounge_change      (heavy)
 *   LLL → stand_down         (heavy)
 */
type Scenario =
  | "q1"
  | "q2"
  | "q3"
  | "thinking"
  | "draft"
  | "propose-coffee-change"
  | "propose-coffee-snack"
  | "propose-quiet-break"
  | "propose-lounge-change"
  | "stand-down";

interface SeededState {
  responses: SwipeResponse[];
  currentIndex: number;
  showTerminal: boolean;
  initialTerminalView?: TerminalView;
}

function seedFromScenario(scenario: Scenario | null): SeededState | null {
  if (!scenario) return null;
  const ts = "2026-04-25T14:07:00.000Z"; // Frozen so captures are deterministic.
  const r = (id: Dimension, direction: SwipeDirection): SwipeResponse => ({
    questionId: id,
    direction,
    timestamp: ts,
  });

  switch (scenario) {
    case "q1":
      return { responses: [], currentIndex: 0, showTerminal: false };
    case "q2":
      return {
        responses: [r("weight", "left")],
        currentIndex: 1,
        showTerminal: false,
      };
    case "q3":
      return {
        responses: [r("weight", "left"), r("hunger", "right")],
        currentIndex: 2,
        showTerminal: false,
      };
    case "thinking":
      return {
        responses: [
          r("weight", "left"),
          r("hunger", "right"),
          r("reshape", "right"),
        ],
        currentIndex: 3,
        showTerminal: true,
        initialTerminalView: "thinking",
      };
    case "propose-coffee-change":
      return {
        responses: [
          r("weight", "left"),
          r("hunger", "right"),
          r("reshape", "right"),
        ],
        currentIndex: 3,
        showTerminal: true,
        initialTerminalView: "propose",
      };
    case "propose-coffee-snack":
      return {
        responses: [
          r("weight", "left"),
          r("hunger", "right"),
          r("reshape", "left"),
        ],
        currentIndex: 3,
        showTerminal: true,
        initialTerminalView: "propose",
      };
    case "propose-quiet-break":
      // Routing requires P1=okay (R) for quiet_break: RLL.
      return {
        responses: [
          r("weight", "right"),
          r("hunger", "left"),
          r("reshape", "left"),
        ],
        currentIndex: 3,
        showTerminal: true,
        initialTerminalView: "propose",
      };
    case "propose-lounge-change":
      return {
        responses: [
          r("weight", "left"),
          r("hunger", "left"),
          r("reshape", "right"),
        ],
        currentIndex: 3,
        showTerminal: true,
        initialTerminalView: "propose",
      };
    case "stand-down":
      // stand_down skips "propose" entirely — TerminalState fast-forwards
      // to "accepted" so the message is the canonical view.
      return {
        responses: [
          r("weight", "left"),
          r("hunger", "left"),
          r("reshape", "left"),
        ],
        currentIndex: 3,
        showTerminal: true,
        initialTerminalView: "accepted",
      };
    case "draft":
      // coffee_shop_change path, jump to the message-draft view.
      return {
        responses: [
          r("weight", "left"),
          r("hunger", "right"),
          r("reshape", "right"),
        ],
        currentIndex: 3,
        showTerminal: true,
        initialTerminalView: "draft",
      };
  }
}

export function SwipeStack() {
  const searchParams = useSearchParams();
  const seed = useMemo(() => {
    const flag = searchParams?.get("scenario") as Scenario | null;
    return seedFromScenario(flag);
  }, [searchParams]);

  const [currentIndex, setCurrentIndex] = useState(seed?.currentIndex ?? 0);
  const [responses, setResponses] = useState<SwipeResponse[]>(
    seed?.responses ?? [],
  );
  const [showTerminal, setShowTerminal] = useState(seed?.showTerminal ?? false);
  // Mirror of TerminalState's current sub-view, lifted up so the page
  // chrome (page-level Dismiss) can hide on the "thinking" beat per the
  // Figma 14:102 layout. Undefined when the swipe phase is active.
  const [terminalView, setTerminalView] = useState<TerminalView | undefined>(
    seed?.initialTerminalView,
  );

  const totalQuestions = QUESTIONS.length;
  const isComplete = currentIndex >= totalQuestions;

  const handleCommit = useCallback(
    (direction: SwipeDirection) => {
      const question = QUESTIONS[currentIndex];
      if (!question) return;

      const response: SwipeResponse = {
        questionId: question.id,
        direction,
        timestamp: new Date().toISOString(),
      };

      setResponses((prev) => [...prev, response]);
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex],
  );

  /**
   * Back-arrow handler. Walks the user backwards through the stack one
   * step at a time, popping the last recorded response so they can
   * re-answer the question they're returning to:
   *   terminal   → last question, with the last response cleared
   *   Q(n>0)     → Q(n-1), with that question's prior response cleared
   *   Q0         → no JS preventDefault, the wrapping <Link> takes them home
   *
   * The Link's href="/" serves as the no-JS fallback for the Q0 case.
   */
  const handleBack = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (showTerminal) {
        e.preventDefault();
        setShowTerminal(false);
        setTerminalView(undefined);
        setCurrentIndex(totalQuestions - 1);
        setResponses((prev) => prev.slice(0, -1));
        return;
      }
      if (currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex((idx) => idx - 1);
        setResponses((prev) => prev.slice(0, -1));
        return;
      }
      // currentIndex === 0: let the Link navigate to "/" and exit the flow.
    },
    [showTerminal, currentIndex, totalQuestions],
  );

  // When the last card commits, wait TERMINAL_PAUSE_MS before transitioning
  // to the terminal state. Gives the exit animation time to finish and the
  // progress bar its beat of completion.
  useEffect(() => {
    if (!isComplete || showTerminal) return;
    const timer = setTimeout(() => {
      setShowTerminal(true);
      // Deferred API contract: on stack completion, log the captured payload
      // with the RAAHA_SWIPE_COMPLETE prefix for downstream pickup. The
      // derived proposal is what Call 5 will eventually return live.
      // eslint-disable-next-line no-console
      console.log("RAAHA_SWIPE_COMPLETE:", {
        responses,
        proposal: deriveProposal(responses),
      });
    }, P.TERMINAL_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [isComplete, showTerminal, responses]);

  // -------------------------------------------------------------------------
  // Visible stack — always render the top and the one peeking underneath.
  // Cards are keyed by id so React never reconciles one question's motion
  // values onto a different question (the "useMotionValue inside conditional
  // renders" gotcha, neutralised).
  // -------------------------------------------------------------------------

  const visibleCards = QUESTIONS.slice(currentIndex, currentIndex + 2);

  const isSwipePhase = !showTerminal;
  const reducedMotion = useReducedMotion();
  const { recordOutcome } = useTodayStore();
  // Thinking beat (Figma 14:102) — page chrome drops out so the page
  // reads as only the progress bar + the Thinking… card.
  const isThinkingBeat = showTerminal && terminalView === "thinking";
  // Final-outcome views (Accepted variants + None / routing fail). The
  // page button switches from a text-only Dismiss to a filled "Complete"
  // primary CTA — the user's affirmative finish to the check-in.
  const isFinalOutcome =
    showTerminal &&
    (terminalView === "accepted" || terminalView === "none");

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-mobile flex-col bg-canvas px-6 pb-6 pt-5">
      {/* Header mirrors the Today screen's date + title pattern so the user
          carries the same orientation cue across the transition. The title
          is fixed to "Wellbeing Check-in" — this is the labelled context for
          every swipe session, regardless of which CTA opened it. The
          back-arrow links home so the user has an explicit way out of the
          flow at any moment. */}
      <header className="flex flex-col gap-4">
        <Link
          href="/"
          aria-label="Back"
          onClick={handleBack}
          className="inline-flex size-6 items-center justify-center text-ink-primary transition-opacity hover:opacity-70"
        >
          <BackArrowIcon />
        </Link>
        <div className="flex flex-col">
          <div className="text-[12px] leading-4 tabular-nums text-ink-secondary">
            Tuesday · 14:07
          </div>
          <p className="text-[24px] leading-8 tracking-tight text-ink-primary [text-wrap:pretty]">
            Raaha Check In
          </p>
        </div>
      </header>

      {/* Progress bar lives OUTSIDE the card stack, above it — not overlaid.
          Sits 24px under the header, mirroring the Figma vertical rhythm. */}
      <div className="mt-6">
        <ProgressBar
          total={totalQuestions}
          currentIndex={Math.min(currentIndex, totalQuestions)}
        />
      </div>

      <section className="relative mt-6 flex flex-1 flex-col items-stretch">
        {showTerminal ? (
          <div className="flex w-full flex-1 items-center justify-center">
            <TerminalState
              responses={responses}
              initialView={seed?.initialTerminalView}
              onViewChange={setTerminalView}
              onAccepted={recordOutcome}
            />
          </div>
        ) : (
          <>
            <div className="relative h-[420px] w-full">
              {visibleCards.map((question, depth) => (
                <SwipeCard
                  key={question.id}
                  question={question}
                  isTop={depth === 0}
                  stackDepth={depth}
                  onCommit={handleCommit}
                />
              ))}
            </div>
            {/* Hint sits 16px under the card stack. accent.ink (warm ochre)
                is the ceremonial accent — used here to make the hint read
                as soft, not instructional. Drops out in terminal phases. */}
            <p className="mt-4 text-center text-[12px] leading-4 text-accent-ink">
              Swipe left or right to select an answer
            </p>
          </>
        )}
      </section>

      {/* Page-level action button. Three modes:
            • Thinking beat (Figma 14:102) → nothing rendered.
            • Final outcome (Accepted variants, None) → "Complete" filled
              primary CTA. The affirmative finish to the check-in.
            • Everything else → "Dismiss" text-only kill button.
          All three routes home; the affordance just changes register so
          the final state reads as a positive close, not an escape. */}
      {isFinalOutcome ? (
        // Complete fades in with the same 350ms ease as TerminalState's
        // FadeBlock, plus a 350ms delay to let the previous view's exit
        // finish first (AnimatePresence mode="wait" inside TerminalState
        // takes ~350ms exit + 350ms enter, so the message is fully
        // visible at T+700ms; we land Complete at the same beat).
        // Reduced motion: no delay, no fade — instant.
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.35, ease: "easeOut", delay: 0.35 }
          }
        >
          <CompleteButton />
        </motion.div>
      ) : (
        !isThinkingBeat && (
          <div className="mt-6">
            <DismissButton />
          </div>
        )
      )}
    </main>
  );
}

/**
 * Final-outcome primary CTA. Filled accent-primary, body-weight 500 white
 * text, full-width — same visual register as the in-flow primary buttons
 * (Send, Book the ten minutes, etc.) so the user reads "Complete" as the
 * positive close, not an escape. Routes home like Dismiss.
 */
function CompleteButton() {
  return (
    <Link
      href="/"
      className="flex w-full items-center justify-center rounded-md bg-accent-primary px-4 py-3 text-body font-medium text-surface transition-opacity hover:opacity-90 active:opacity-80"
    >
      Complete
    </Link>
  );
}

/**
 * Page-level dismiss control. Text-only button (no fill, no border) in
 * accent.primary, full-width per the Figma update. Links to "/" so the
 * user always has an explicit exit. Real dismiss semantics (e.g. logging
 * abandonment, returning to a specific upstream view) will follow once
 * the surrounding button logic is revisited.
 */
function DismissButton() {
  return (
    <Link
      href="/"
      className="flex w-full items-center justify-center rounded-sm px-3 py-2 text-body font-medium text-accent-primary transition-opacity hover:opacity-70"
    >
      Dismiss
    </Link>
  );
}

/**
 * 24×24 outline back-arrow. Inlined SVG (no asset to ship), uses
 * currentColor so it inherits ink-primary from the link wrapper.
 */
function BackArrowIcon() {
  return (
    <svg
      aria-hidden
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}
