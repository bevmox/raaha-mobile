// ---------------------------------------------------------------------------
// physics.ts — every gesture tunable in one place.
//
// Saturday tuning touches only this file. Components must import from here;
// never hardcode a number that describes how the gesture feels.
// Each constant documented in /PHYSICS.md at the repo root.
// ---------------------------------------------------------------------------

// --- Commit thresholds (horizontal: left / right) ---------------------------

/** Fraction of window width the card must travel to commit an L/R swipe. */
export const HORIZONTAL_DISTANCE_THRESHOLD = 0.3;

/** Velocity (px/s) that commits an L/R swipe regardless of distance travelled. */
export const HORIZONTAL_VELOCITY_THRESHOLD = 500;

// --- Commit thresholds (vertical: up = skip) --------------------------------
// Stricter than horizontal by design. Up is a deliberate action — we don't
// want an accidental down-scroll or a long vertical drift to register as skip.

/** Fraction of window height the card must travel upward to commit a skip. */
export const VERTICAL_DISTANCE_THRESHOLD = 0.4;

/** Upward velocity (px/s) that commits a skip. */
export const VERTICAL_VELOCITY_THRESHOLD = 700;

// --- Rotation during drag ---------------------------------------------------

/**
 * Max rotation applied at the screen edge, in degrees. Raaha is not Tinder —
 * 6° is quiet. Crank past 10° and it starts feeling like a dating app.
 */
export const MAX_ROTATION_DEG = 6;

/**
 * Distance (px) at which rotation reaches MAX_ROTATION_DEG. Approximates the
 * half-width of a 390px viewport; card at x = ROTATION_RANGE_PX rotates the
 * maximum amount. Keep in sync with design viewport if it changes.
 */
export const ROTATION_RANGE_PX = 195;

// --- Exit animation (after commit) ------------------------------------------

/** Horizontal exit duration (s). Card flies off-screen in this time. */
export const EXIT_DURATION_HORIZONTAL_S = 0.3;

/** Vertical (up) exit duration (s). Marginally slower — up feels heavier. */
export const EXIT_DURATION_VERTICAL_S = 0.35;

/**
 * How far off-screen the card flies on commit, as a multiple of viewport size.
 * Keep > 1 so rotation-plus-translation can't leave a sliver on screen.
 */
export const EXIT_DISTANCE_MULTIPLIER = 1.25;

// --- Spring-back (non-commit) -----------------------------------------------
// Framer Motion spring. Higher stiffness = snappier; higher damping = less bounce.

export const SPRING_STIFFNESS = 400;
export const SPRING_DAMPING = 30;

// --- Axis lock --------------------------------------------------------------

/**
 * Dominant-axis movement (px) required before the drag locks to that axis.
 * Prevents diagonal confusion between L/R and up-skip.
 */
export const AXIS_LOCK_THRESHOLD_PX = 10;

// --- Stack layering ---------------------------------------------------------

/** Scale of the card peeking underneath the top card. */
export const PEEK_SCALE = 0.95;

/** Y-offset (px) of the peeking card — pushes it down behind the top card. */
export const PEEK_Y_OFFSET_PX = 8;

/** Duration (s) for the peeking card to promote into the top slot. */
export const STACK_PROMOTE_DURATION_S = 0.3;

// --- Terminal state ---------------------------------------------------------

/** Pause (ms) after last card exits before the terminal state begins. */
export const TERMINAL_PAUSE_MS = 800;

/** Delay (ms) between "Thinking…" appearing and the proposal UI revealing. */
export const TERMINAL_PROPOSAL_DELAY_MS = 1500;

// --- Reduced motion ---------------------------------------------------------
// When prefers-reduced-motion is set we zero rotation and shorten exits.
// We keep the drag translation itself because the user initiates it — it's
// their finger, not an animation.

export const REDUCED_MOTION_EXIT_DURATION_S = 0.15;
export const REDUCED_MOTION_ROTATION_DEG = 0;
