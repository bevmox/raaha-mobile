"use client";

import { animate, motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { useEffect, useState } from "react";

import * as P from "@/lib/physics";
import type { SwipeDirection, SwipeQuestion } from "@/lib/questions";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface SwipeCardProps {
  question: SwipeQuestion;
  /** True only for the interactive card on top of the stack. */
  isTop: boolean;
  /**
   * 0 = top (visible & interactive), 1 = peeking behind top, 2+ = hidden.
   * Used to compute base transform for stack layering.
   */
  stackDepth: number;
  /** Fires once a commit threshold is crossed. Only called on the top card. */
  onCommit: (direction: SwipeDirection) => void;
}

export function SwipeCard({ question, isTop, stackDepth, onCommit }: SwipeCardProps) {
  const reducedMotion = useReducedMotion();

  // Drag values — composed relative to the peek wrapper so stack layering and
  // drag don't fight each other (the known framer-motion gotcha with layout).
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotation: linear interpolation from x. Clamped at edges so the card can't
  // flop past MAX_ROTATION_DEG if the user drags off-screen.
  const rotateRange = reducedMotion ? P.REDUCED_MOTION_ROTATION_DEG : P.MAX_ROTATION_DEG;
  const rotate = useTransform(
    x,
    [-P.ROTATION_RANGE_PX, 0, P.ROTATION_RANGE_PX],
    [-rotateRange, 0, rotateRange],
    { clamp: true },
  );

  // Commit lock: once a commit fires we freeze the card to prevent a double-
  // fire during the exit animation (the spec's hard constraint).
  const [committed, setCommitted] = useState(false);

  // Reset transient state if the card is mounted fresh (keyed by questionId,
  // so this effectively only fires once per card lifetime).
  useEffect(() => {
    setCommitted(false);
  }, [question.id]);

  // -------------------------------------------------------------------------
  // Gesture handlers
  // -------------------------------------------------------------------------

  const handleDragStart = () => {
    if (typeof document !== "undefined") {
      document.body.classList.add("is-swiping");
    }
  };

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (typeof document !== "undefined") {
      document.body.classList.remove("is-swiping");
    }
    if (committed) return;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const dx = x.get();
    const dy = y.get();
    const vx = info.velocity.x;
    const vy = info.velocity.y;

    // Horizontal commit — distance OR velocity. Framer's dragDirectionLock
    // has already ensured dy is near-zero if we went horizontal, so we can
    // trust |dx| > |dy| as the axis signal.
    const horizontalDominant = Math.abs(dx) >= Math.abs(dy);
    const horizontalCommit =
      horizontalDominant &&
      (Math.abs(dx) > viewportW * P.HORIZONTAL_DISTANCE_THRESHOLD ||
        Math.abs(vx) > P.HORIZONTAL_VELOCITY_THRESHOLD);

    if (horizontalCommit) {
      // Direction from the dominant sign of displacement (fallback to
      // velocity if the user flicked fast and released near center).
      const direction: SwipeDirection =
        (dx === 0 ? vx : dx) < 0 ? "left" : "right";
      setCommitted(true);
      onCommit(direction);

      const targetX =
        (direction === "left" ? -1 : 1) * viewportW * P.EXIT_DISTANCE_MULTIPLIER;
      const duration = reducedMotion
        ? P.REDUCED_MOTION_EXIT_DURATION_S
        : P.EXIT_DURATION_HORIZONTAL_S;
      animate(x, targetX, { duration, ease: "easeOut" });
      return;
    }

    // Vertical commit — only upward counts. Downward drag springs back.
    const verticalCommit =
      !horizontalDominant &&
      (dy < -viewportH * P.VERTICAL_DISTANCE_THRESHOLD ||
        vy < -P.VERTICAL_VELOCITY_THRESHOLD);

    if (verticalCommit) {
      setCommitted(true);
      onCommit("up");

      const targetY = -viewportH * P.EXIT_DISTANCE_MULTIPLIER;
      const duration = reducedMotion
        ? P.REDUCED_MOTION_EXIT_DURATION_S
        : P.EXIT_DURATION_VERTICAL_S;
      animate(y, targetY, { duration, ease: "easeOut" });
      return;
    }

    // No commit — spring back to center on both axes.
    animate(x, 0, {
      type: "spring",
      stiffness: P.SPRING_STIFFNESS,
      damping: P.SPRING_DAMPING,
    });
    animate(y, 0, {
      type: "spring",
      stiffness: P.SPRING_STIFFNESS,
      damping: P.SPRING_DAMPING,
    });
  };

  // -------------------------------------------------------------------------
  // Layering — peek scale & y-offset
  // -------------------------------------------------------------------------

  // Only cards at depth 0 and 1 render. Depth > 1 is hidden by the parent.
  const baseScale = stackDepth === 0 ? 1 : P.PEEK_SCALE;
  const baseY = stackDepth === 0 ? 0 : P.PEEK_Y_OFFSET_PX;

  return (
    // Wrapper owns the layering transform. Keeping it separate from the
    // draggable motion.div below avoids the drag-vs-layout-animation fight.
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{ scale: baseScale, y: baseY }}
      transition={{
        duration: P.STACK_PROMOTE_DURATION_S,
        ease: "easeOut",
      }}
      // z-index: top card above peeking card. Terminal card (depth>1) shouldn't
      // render at all, but we guard anyway.
      style={{ zIndex: 10 - stackDepth, pointerEvents: isTop ? "auto" : "none" }}
      aria-hidden={!isTop}
    >
      <motion.div
        // drag is gated to the top, un-committed card only. Both are hard
        // constraints from the spec.
        drag={isTop && !committed}
        dragDirectionLock
        dragMomentum={false}
        dragElastic={1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x, y, rotate, touchAction: "none" }}
        className="flex h-full w-full cursor-grab select-none items-stretch active:cursor-grabbing"
      >
        <CardSurface question={question} />
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// CardSurface — the visual container. No icons, no illustrations, no colour
// judgment on options. Typography and whitespace carry the warmth.
// ---------------------------------------------------------------------------

function CardSurface({ question }: { question: SwipeQuestion }) {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-lg bg-surface p-6 shadow-sm">
      <p className="text-body-lg font-regular text-ink-primary">
        {question.prompt}
      </p>

      {/* Option labels in equal visual weight at the bottom. No colour tint,
          no active/preferred styling — the swipe IS the affordance. */}
      <div className="flex items-center gap-2 pt-6">
        <OptionLabel>{question.leftLabel}</OptionLabel>
        <OptionSeparator />
        <OptionLabel>{question.rightLabel}</OptionLabel>
      </div>
    </div>
  );
}

function OptionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex-1 rounded-sm border border-line-hairline px-3 py-2 text-center text-caption text-ink-secondary">
      {children}
    </span>
  );
}

function OptionSeparator() {
  return <span className="text-caption text-ink-tertiary">·</span>;
}
