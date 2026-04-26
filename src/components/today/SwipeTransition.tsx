"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { ENTER_EASE, SKELETON_HOLD_MS } from "@/lib/today-timing";

interface SwipeTransitionProps {
  /**
   * Ordered list of labels shown in succession during the hold. The full
   * SKELETON_HOLD_MS is divided evenly among them — e.g. two labels each
   * get half the window. Labels crossfade in/out via AnimatePresence so
   * the swap reads as a settle, not a flicker.
   *
   * Single-label arrays are valid — the label simply persists for the
   * full hold and behaves identically to the previous single-label API.
   */
  labels: readonly string[];
}

/**
 * Full-bleed interstitial shown after a "Check in" tap and
 * before the swipe page renders. The progress bar fills over the same
 * duration the Today screen holds its skeletons (SKELETON_HOLD_MS), so
 * the perceived rhythm of "the app pausing to settle" is consistent
 * across screens. The label cycles inside that window — first label is
 * preparatory ("getting comfortable"), second is reassuring ("this is
 * a safe place"), so the user reads a small moment of intent before the
 * swipe surface appears.
 *
 * The overlay sits above the Today content (z-50) and fades in over the
 * same ease curve the rest of the app uses. Navigation to /swipe is
 * fired by the parent (HomeToday) at SKELETON_HOLD_MS so the bar reaches
 * 100% just as the route swaps.
 */
export function SwipeTransition({ labels }: SwipeTransitionProps) {
  const [labelIndex, setLabelIndex] = useState(0);

  useEffect(() => {
    if (labels.length <= 1) return;

    // Divide the hold evenly among labels and schedule a swap at each
    // boundary. We schedule all timers up-front (rather than chaining)
    // so a slow main thread can't cumulatively drift the sequence.
    const stepMs = SKELETON_HOLD_MS / labels.length;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < labels.length; i++) {
      timers.push(
        setTimeout(() => setLabelIndex(i), Math.round(stepMs * i)),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [labels]);

  const label = labels[labelIndex] ?? "";

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={`${label}. Opening check-in.`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: ENTER_EASE }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas px-6"
    >
      <div className="flex w-full max-w-mobile flex-col items-center gap-4">
        {/* mode="wait" keeps the previous label fully out before the next
            one comes in — avoids two strings stacking during the swap. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={labelIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: ENTER_EASE }}
            className="m-0 text-body text-ink-primary [text-wrap:pretty]"
          >
            {label}
          </motion.p>
        </AnimatePresence>
        <div
          className="h-[3px] w-[200px] overflow-hidden rounded-sm bg-line-hairline"
          aria-hidden
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: SKELETON_HOLD_MS / 1000,
              ease: "linear",
            }}
            className="h-full bg-accent-primary"
          />
        </div>
      </div>
    </motion.div>
  );
}
