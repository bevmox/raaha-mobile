/**
 * Timing constants for the Home / Today screen's three-phase load.
 * Mirrors the convention in PHYSICS.md: every tunable lives in one place,
 * documented, so design tweaks don't require code spelunking.
 *
 * Phases:
 *   1. "loading" — skeletons across header + 3 cards.
 *   2. "loaded"  — real content for those 3; banner not yet mounted.
 *   3. "banner"  — UpcomingMeetingCard slides in (push-down via height auto).
 *
 * Times are intentionally short — this is a UI rhythm, not a fake delay.
 * When real data fetching lands, replace the timers with actual loading
 * state and keep these constants only for the banner entry transition.
 */

/** Duration to hold the skeleton state before flipping to "loaded". */
export const SKELETON_HOLD_MS = 1500;

/**
 * Pause between "loaded" and the banner sliding in. Gives the eye a moment
 * to register the home content before the meeting affordance interrupts.
 */
export const BANNER_DELAY_AFTER_LOAD_MS = 900;

/** Banner entry transition duration (Framer Motion seconds). */
export const BANNER_ENTER_DURATION_S = 0.32;

/**
 * Inner-card content (opacity + translate) starts slightly behind the
 * height growth, so the banner reads as a pull-down rather than a pop.
 */
export const BANNER_ENTER_DELAY_S = 0.08;

/** Cubic-bezier curve matching the prototype's `--easing-default`. */
export const ENTER_EASE = [0.2, 0, 0, 1] as const;
